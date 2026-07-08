<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BestProductController extends Controller
{
    private const VALID_STATUSES = ['success'];

    public function index()
    {
        return Inertia::render('Dashboard/Restock/Index');
    }

    public function validateData(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to'   => 'required|date|after_or_equal:date_from',
        ]);

        $dateFrom = Carbon::parse($request->date_from)->startOfDay();
        $dateTo   = Carbon::parse($request->date_to)->endOfDay();

        $count = Transaction::whereIn('status', self::VALID_STATUSES)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();

        if ($count === 0) {
            return response()->json([
                'valid'   => false,
                'message' => "Tidak ada transaksi selesai antara {$request->date_from} dan {$request->date_to}.",
            ]);
        }

        $productCount = TransactionDetail::whereHas('transaction', function ($q) use ($dateFrom, $dateTo) {
                $q->whereIn('status', self::VALID_STATUSES)
                  ->whereBetween('created_at', [$dateFrom, $dateTo]);
            })
            ->where('qty', '>', 0)
            ->distinct('product_id')
            ->count('product_id');

        return response()->json([
            'valid'          => true,
            'message'        => "Data valid: {$count} transaksi selesai dengan {$productCount} produk berbeda.",
            'total_trx'      => $count,
            'total_products' => $productCount,
        ]);
    }

    public function calculate(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to'   => 'required|date|after_or_equal:date_from',
        ]);

        $dateFrom  = Carbon::parse($request->date_from)->startOfDay();
        $dateTo    = Carbon::parse($request->date_to)->endOfDay();
        $totalDays = max(1, (int) $dateFrom->diffInDays($dateTo) + 1);

        // Ambil total penjualan per produk — hanya dari transaksi VALID
        $salesData = TransactionDetail::selectRaw(
                'product_id,
                 SUM(GREATEST(qty, 0))  AS total_qty,
                 SUM(price)             AS total_revenue,
                 COUNT(DISTINCT transaction_id) AS total_trx'
            )
            ->whereHas('transaction', function ($q) use ($dateFrom, $dateTo) {
                $q->whereIn('status', self::VALID_STATUSES)
                  ->whereBetween('created_at', [$dateFrom, $dateTo]);
            })
            ->where('qty', '>', 0)
            ->groupBy('product_id')
            ->havingRaw('SUM(GREATEST(qty, 0)) > 0')
            ->orderByRaw('SUM(GREATEST(qty, 0)) DESC')   // urutkan terlaris dulu
            ->get();

        if ($salesData->isEmpty()) {
            return response()->json([
                'results' => [],
                'message' => 'Tidak ada data penjualan yang valid.',
            ]);
        }

        // Load info produk
        $productIds = $salesData->pluck('product_id')->toArray();
        $products   = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // Ambil data detail transaksi mentah untuk keperluan Uji Validasi (Tabulasi)
        $rawDetails = TransactionDetail::with(['transaction:id,invoice,created_at', 'product:id,title'])
            ->whereHas('transaction', function ($q) use ($dateFrom, $dateTo) {
                $q->whereIn('status', self::VALID_STATUSES)
                  ->whereBetween('created_at', [$dateFrom, $dateTo]);
            })
            ->where('qty', '>', 0)
            ->get()
            ->map(function($detail) {
                return [
                    'invoice'      => $detail->transaction?->invoice ?? '-',
                    'date'         => $detail->transaction?->created_at ? \Carbon\Carbon::parse($detail->transaction->created_at)->format('Y-m-d H:i') : '-',
                    'product_name' => $detail->product?->title ?? '-',
                    'qty'          => (int) $detail->qty,
                    'price'        => (float) $detail->price,
                ];
            });

        $results = [];
        foreach ($salesData as $sale) {
            $product = $products->get($sale->product_id);
            if (! $product) continue;

            $qty       = max(0, (float) $sale->total_qty);
            $stock     = max(0, (float) $product->stock);
            $revenue   = max(0, (float) $sale->total_revenue);
            $avgPerDay = $totalDays > 0 ? round($qty / $totalDays, 2) : 0;

            $results[] = [
                'rank'         => 0, // Set after sorting
                'product_id'   => $sale->product_id,
                'product_name' => $product->title,
                'category'     => $product->category?->name ?? '-',
                'total_qty'    => (int) $qty,
                'total_trx'    => (int) $sale->total_trx,
                'total_revenue'=> $revenue,
                'avg_per_day'  => $avgPerDay,
                'stock'        => (int) $stock,
                'sell_price'   => (float) $product->sell_price,
                'buy_price'    => (float) $product->buy_price,
            ];
        }

        // Sort by total_qty descending, then by product_name ascending
        usort($results, function ($a, $b) {
            if ($b['total_qty'] === $a['total_qty']) {
                return strcmp($a['product_name'], $b['product_name']);
            }
            return $b['total_qty'] <=> $a['total_qty'];
        });

        // re-assign ranks & calculate validation_score
        $maxQty = count($results) > 0 ? max(array_column($results, 'total_qty')) : 1;
        if ($maxQty <= 0) {
            $maxQty = 1;
        }

        foreach ($results as $index => &$result) {
            $result['rank'] = $index + 1;
            $result['validation_score'] = round(($result['total_qty'] / $maxQty) * 100, 2);
        }
        unset($result);

        return response()->json([
            'results'     => $results,
            'raw_details' => $rawDetails,
            'total_days'  => $totalDays,
            'date_from'   => $request->date_from,
            'date_to'     => $request->date_to,
        ]);
    }
}

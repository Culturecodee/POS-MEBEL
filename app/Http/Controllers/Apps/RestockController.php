<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestockController extends Controller
{
    /**
     * Render halaman TOPSIS Restock.
     */
    public function index()
    {
        return Inertia::render('Dashboard/Restock/Index');
    }

    /**
     * Validasi: cek apakah ada transaksi sukses di rentang tanggal.
     * POST /dashboard/restock/validate
     */
    public function validateData(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to'   => 'required|date|after_or_equal:date_from',
        ]);

        $dateFrom = Carbon::parse($request->date_from)->startOfDay();
        $dateTo   = Carbon::parse($request->date_to)->endOfDay();

        $count = Transaction::where('status', 'success')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();

        $productCount = TransactionDetail::whereHas('transaction', function ($q) use ($dateFrom, $dateTo) {
            $q->where('status', 'success')
              ->whereBetween('created_at', [$dateFrom, $dateTo]);
        })->distinct('product_id')->count('product_id');

        if ($count === 0) {
            return response()->json([
                'valid'   => false,
                'message' => "Tidak ada transaksi sukses antara {$request->date_from} dan {$request->date_to}.",
            ]);
        }

        return response()->json([
            'valid'         => true,
            'message'       => "Data valid: ditemukan {$count} transaksi dengan {$productCount} produk berbeda.",
            'total_trx'     => $count,
            'total_products'=> $productCount,
        ]);
    }

    /**
     * Hitung TOPSIS dan kembalikan ranking restock.
     * POST /dashboard/restock/calculate
     */
    public function calculate(Request $request)
    {
        $request->validate([
            'date_from'   => 'required|date',
            'date_to'     => 'required|date|after_or_equal:date_from',
            'target_days' => 'required|integer|min:1',
            'buffer'      => 'required|numeric|min:0|max:100',
        ]);

        $dateFrom   = Carbon::parse($request->date_from)->startOfDay();
        $dateTo     = Carbon::parse($request->date_to)->endOfDay();
        $targetDays = (int) $request->target_days;
        $buffer     = (float) $request->buffer;

        // Rentang hari
        $totalDays = max(1, $dateFrom->diffInDays($dateTo) + 1);

        // Ambil semua produk yang pernah terjual di rentang tanggal
        $salesData = TransactionDetail::selectRaw('
                product_id,
                SUM(qty) as total_qty,
                SUM(price) as total_revenue
            ')
            ->whereHas('transaction', function ($q) use ($dateFrom, $dateTo) {
                $q->where('status', 'success')
                  ->whereBetween('created_at', [$dateFrom, $dateTo]);
            })
            ->groupBy('product_id')
            ->get()
            ->keyBy('product_id');

        if ($salesData->isEmpty()) {
            return response()->json(['results' => [], 'message' => 'Tidak ada data penjualan.']);
        }

        // Load produk
        $productIds = $salesData->keys()->toArray();
        $products   = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // ── Bangun matriks keputusan ─────────────────────────────────
        // Kriteria:
        //   C1: Total Penjualan (qty)    → BENEFIT (↑)
        //   C2: Stok Saat Ini            → COST    (↓ = lebih butuh restock)
        //   C3: Hari Stok Tersisa        → COST    (↓ = lebih urgent)
        //   C4: Profit per Unit          → BENEFIT (↑)
        $weights = [0.35, 0.30, 0.20, 0.15];
        $isBenefit = [true, false, false, true];

        $matrix = []; // matrix[i] = [c1, c2, c3, c4]
        $items  = []; // raw info per produk

        foreach ($salesData as $productId => $sale) {
            $product = $products->get($productId);
            if (! $product) {
                continue;
            }

            $qty         = (float) $sale->total_qty;
            $avgPerDay   = $qty / $totalDays;
            $stock       = (float) $product->stock;
            $profitUnit  = max(0, (float) $product->sell_price - (float) $product->buy_price);
            $stockDays   = $avgPerDay > 0 ? $stock / $avgPerDay : 9999; // hari stok tersisa

            $matrix[] = [$qty, $stock, $stockDays, $profitUnit];
            $items[]  = [
                'product_id'   => $productId,
                'product_name' => $product->title,
                'stock'        => $stock,
                'avg_per_day'  => $avgPerDay,
                'total_qty'    => $qty,
                'profit_unit'  => $profitUnit,
                'stock_days'   => $stockDays,
                'sell_price'   => (float) $product->sell_price,
                'buy_price'    => (float) $product->buy_price,
            ];
        }

        if (empty($matrix)) {
            return response()->json(['results' => [], 'message' => 'Tidak ada data produk yang valid.']);
        }

        $n = count($matrix); // jumlah alternatif
        $m = 4;              // jumlah kriteria

        // ── Normalisasi (r_ij = x_ij / sqrt(sum(x_kj^2))) ──────────
        $colNorm = array_fill(0, $m, 0.0);
        foreach ($matrix as $row) {
            for ($j = 0; $j < $m; $j++) {
                $colNorm[$j] += $row[$j] ** 2;
            }
        }
        for ($j = 0; $j < $m; $j++) {
            $colNorm[$j] = sqrt($colNorm[$j]);
        }

        $normalized = [];
        foreach ($matrix as $i => $row) {
            for ($j = 0; $j < $m; $j++) {
                $normalized[$i][$j] = $colNorm[$j] > 0 ? $row[$j] / $colNorm[$j] : 0;
            }
        }

        // ── Weighted normalized (v_ij = w_j * r_ij) ─────────────────
        $weighted = [];
        foreach ($normalized as $i => $row) {
            for ($j = 0; $j < $m; $j++) {
                $weighted[$i][$j] = $weights[$j] * $row[$j];
            }
        }

        // ── Ideal Positif (A+) dan Ideal Negatif (A-) ───────────────
        $idealPos = [];
        $idealNeg = [];
        for ($j = 0; $j < $m; $j++) {
            $col = array_column($weighted, $j);
            if ($isBenefit[$j]) {
                $idealPos[$j] = max($col);
                $idealNeg[$j] = min($col);
            } else {
                $idealPos[$j] = min($col);
                $idealNeg[$j] = max($col);
            }
        }

        // ── Jarak ke A+ dan A- (D+, D-) ─────────────────────────────
        $dPlus  = [];
        $dMinus = [];
        for ($i = 0; $i < $n; $i++) {
            $sumPlus  = 0;
            $sumMinus = 0;
            for ($j = 0; $j < $m; $j++) {
                $sumPlus  += ($weighted[$i][$j] - $idealPos[$j]) ** 2;
                $sumMinus += ($weighted[$i][$j] - $idealNeg[$j]) ** 2;
            }
            $dPlus[$i]  = sqrt($sumPlus);
            $dMinus[$i] = sqrt($sumMinus);
        }

        // ── Skor C_i ─────────────────────────────────────────────────
        $scores = [];
        for ($i = 0; $i < $n; $i++) {
            $denom    = $dPlus[$i] + $dMinus[$i];
            $scores[$i] = $denom > 0 ? $dMinus[$i] / $denom : 0;
        }

        // ── Rekomendasi qty restock ───────────────────────────────────
        $results = [];
        for ($i = 0; $i < $n; $i++) {
            $item      = $items[$i];
            $avgPerDay = $item['avg_per_day'];

            // Qty ideal = target_hari × avg/hari × (1 + buffer/100)
            $qtyIdeal = $targetDays * $avgPerDay * (1 + $buffer / 100);
            $qtyRec   = max(0, ceil($qtyIdeal - $item['stock']));

            $results[$i] = [
                'product_id'   => $item['product_id'],
                'product_name' => $item['product_name'],
                'score'        => round($scores[$i], 6),
                'qty_restock'  => (int) $qtyRec,
                'stock'        => $item['stock'],
                'avg_per_day'  => round($avgPerDay, 4),
                'total_qty'    => $item['total_qty'],
                'stock_days'   => round($item['stock_days'], 2),
                'profit_unit'  => $item['profit_unit'],
                // Detail perhitungan untuk modal
                'detail' => [
                    'criteria_raw'        => $matrix[$i],
                    'criteria_normalized' => $normalized[$i],
                    'criteria_weighted'   => $weighted[$i],
                    'ideal_pos'           => $idealPos,
                    'ideal_neg'           => $idealNeg,
                    'd_plus'              => round($dPlus[$i], 6),
                    'd_minus'             => round($dMinus[$i], 6),
                    'score'               => round($scores[$i], 6),
                ],
            ];
        }

        // Sort descending by score → ranking
        usort($results, fn($a, $b) => $b['score'] <=> $a['score']);
        foreach ($results as $rank => &$r) {
            $r['rank'] = $rank + 1;
        }
        unset($r);

        return response()->json([
            'results'    => array_values($results),
            'total_days' => $totalDays,
            'date_from'  => $request->date_from,
            'date_to'    => $request->date_to,
            'weights'    => $weights,
            'ideal_pos'  => $idealPos,
            'ideal_neg'  => $idealNeg,
        ]);
    }
}

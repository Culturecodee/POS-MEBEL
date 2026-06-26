<?php
namespace App\Http\Controllers\Apps;

use App\Exceptions\PaymentGatewayException;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\PaymentSetting;
use App\Models\Product;
use App\Models\Transaction;
use App\Services\Payments\PaymentGatewayManager;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TransactionController extends Controller
{
    private const MANUAL_PAYMENT_METHODS = [
        'bank_bri',
    ];

    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        $userId = auth()->user()->id;

        // Get active cart items (not held)
        $carts = Cart::with('product')
            ->where('cashier_id', $userId)
            ->active()
            ->latest()
            ->get();

        // Get held carts grouped by hold_id
        $heldCarts = Cart::with('product:id,title,sell_price,image')
            ->where('cashier_id', $userId)
            ->held()
            ->get()
            ->groupBy('hold_id')
            ->map(function ($items, $holdId) {
                $first = $items->first();
                return [
                    'hold_id'     => $holdId,
                    'label'       => $first->hold_label,
                    'held_at'     => $first->held_at?->toISOString(),
                    'items_count' => $items->sum('qty'),
                    'total'       => $items->sum('price'),
                ];
            })
            ->values();

        //get all customers
        $customers = auth()->user()->isCustomer()
            ? Customer::where('name', auth()->user()->name)->latest()->get()
            : Customer::latest()->get();

        // get all products with categories for product grid
        $products = Product::with('category:id,name')
            ->select('id', 'barcode', 'title', 'description', 'image', 'buy_price', 'sell_price', 'stock', 'category_id')
            ->where('stock', '>', 0)
            ->orderBy('title')
            ->get();

        // get all categories
        $categories = \App\Models\Category::select('id', 'name', 'image')
            ->orderBy('name')
            ->get();

        $paymentSetting = PaymentSetting::first();

        $carts_total = 0;
        foreach ($carts as $cart) {
            $carts_total += $cart->price;
        }

        $defaultGateway = $paymentSetting?->default_gateway ?? 'cash';
        if (
            $defaultGateway !== 'cash'
            && (! $paymentSetting || ! $paymentSetting->isGatewayReady($defaultGateway))
        ) {
            $defaultGateway = 'cash';
        }

        return Inertia::render('Dashboard/Transactions/Index', [
            'carts'                 => $carts,
            'carts_total'           => $carts_total,
            'heldCarts'             => $heldCarts,
            'customers'             => $customers,
            'products'              => $products,
            'categories'            => $categories,
            'paymentGateways'       => $paymentSetting?->enabledGateways() ?? [],
            'defaultPaymentGateway' => $defaultGateway,
        ]);
    }

    /**
     * searchProduct
     *
     * @param  mixed $request
     * @return void
     */
    public function searchProduct(Request $request)
    {
        //find product by barcode
        $product = Product::where('barcode', $request->barcode)->first();

        if ($product) {
            return response()->json([
                'success' => true,
                'data'    => $product,
            ]);
        }

        return response()->json([
            'success' => false,
            'data'    => null,
        ]);
    }

    /**
     * addToCart
     *
     * @param  mixed $request
     * @return void
     */
    public function addToCart(Request $request)
    {
        // Cari produk berdasarkan ID yang diberikan
        $product = Product::whereId($request->product_id)->first();

        // Jika produk tidak ditemukan, redirect dengan pesan error
        if (! $product) {
            return redirect()->back()->with('error', 'Product not found.');
        }

        // Cek stok produk
        if ($product->stock < $request->qty) {
            return redirect()->back()->with('error', 'Out of Stock Product!.');
        }

        // Cek keranjang
        $cart = Cart::with('product')
            ->where('product_id', $request->product_id)
            ->where('cashier_id', auth()->user()->id)
            ->first();

        if ($cart) {
            // Tingkatkan qty
            $cart->increment('qty', $request->qty);

            // Jumlahkan harga * kuantitas
            $cart->price = $cart->product->sell_price * $cart->qty;

            $cart->save();
        } else {
            // Insert ke keranjang
            Cart::create([
                'cashier_id' => auth()->user()->id,
                'product_id' => $request->product_id,
                'qty'        => $request->qty,
                'price'      => $request->sell_price * $request->qty,
            ]);
        }

        return redirect()->route('transactions.index')->with('success', 'Product Added Successfully!.');
    }

    /**
     * destroyCart
     *
     * @param  mixed $request
     * @return void
     */
    public function destroyCart($cart_id)
    {
        $cart = Cart::with('product')->whereId($cart_id)->first();

        if ($cart) {
            $cart->delete();
            return back();
        } else {
            // Handle case where no cart is found (e.g., redirect with error message)
            return back()->withErrors(['message' => 'Cart not found']);
        }

    }

    /**
     * updateCart - Update cart item quantity
     *
     * @param  mixed $request
     * @param  int $cart_id
     * @return void
     */
    public function updateCart(Request $request, $cart_id)
    {
        $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $cart = Cart::with('product')->whereId($cart_id)
            ->where('cashier_id', auth()->user()->id)
            ->first();

        if (! $cart) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found',
            ], 404);
        }

        // Check stock availability
        if ($cart->product->stock < $request->qty) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi. Tersedia: ' . $cart->product->stock,
            ], 422);
        }

        // Update quantity and price
        $cart->qty   = $request->qty;
        $cart->price = $cart->product->sell_price * $request->qty;
        $cart->save();

        return back()->with('success', 'Quantity updated successfully');
    }

    /**
     * holdCart - Hold current cart items for later
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function holdCart(Request $request)
    {
        $request->validate([
            'label' => 'nullable|string|max:50',
        ]);

        $userId = auth()->user()->id;

        // Get active cart items
        $activeCarts = Cart::where('cashier_id', $userId)
            ->active()
            ->get();

        if ($activeCarts->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Keranjang kosong, tidak ada yang bisa ditahan',
            ], 422);
        }

        // Generate unique hold ID
        $holdId = 'HOLD-' . strtoupper(uniqid());
        $label  = $request->label ?: 'Transaksi ' . now()->format('H:i');

        // Mark all active cart items as held
        Cart::where('cashier_id', $userId)
            ->active()
            ->update([
                'hold_id'    => $holdId,
                'hold_label' => $label,
                'held_at'    => now(),
            ]);

        return back()->with('success', 'Transaksi ditahan: ' . $label);
    }

    /**
     * resumeCart - Resume a held cart
     *
     * @param  string $holdId
     * @return \Illuminate\Http\JsonResponse
     */
    public function resumeCart($holdId)
    {
        $userId = auth()->user()->id;

        // Check if there are any active carts (not held)
        $activeCarts = Cart::where('cashier_id', $userId)
            ->active()
            ->count();

        if ($activeCarts > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Selesaikan atau tahan transaksi aktif terlebih dahulu',
            ], 422);
        }

        // Get held carts
        $heldCarts = Cart::where('cashier_id', $userId)
            ->forHold($holdId)
            ->get();

        if ($heldCarts->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi ditahan tidak ditemukan',
            ], 404);
        }

        // Resume by clearing hold info
        Cart::where('cashier_id', $userId)
            ->forHold($holdId)
            ->update([
                'hold_id'    => null,
                'hold_label' => null,
                'held_at'    => null,
            ]);

        return back()->with('success', 'Transaksi dilanjutkan');
    }

    /**
     * clearHold - Delete a held cart
     *
     * @param  string $holdId
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearHold($holdId)
    {
        $userId = auth()->user()->id;

        $deleted = Cart::where('cashier_id', $userId)
            ->forHold($holdId)
            ->delete();

        if ($deleted === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi ditahan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi ditahan berhasil dihapus',
        ]);
    }

    /**
     * getHeldCarts - Get all held carts for current user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHeldCarts()
    {
        $userId = auth()->user()->id;

        $heldCarts = Cart::with('product:id,title,sell_price,image')
            ->where('cashier_id', $userId)
            ->held()
            ->get()
            ->groupBy('hold_id')
            ->map(function ($items, $holdId) {
                $first = $items->first();
                return [
                    'hold_id'     => $holdId,
                    'label'       => $first->hold_label,
                    'held_at'     => $first->held_at,
                    'items_count' => $items->sum('qty'),
                    'total'       => $items->sum('price'),
                    'items'       => $items->map(fn($item) => [
                        'id'      => $item->id,
                        'product' => $item->product,
                        'qty'     => $item->qty,
                        'price'   => $item->price,
                    ]),
                ];
            })
            ->values();

        return response()->json([
            'success'    => true,
            'held_carts' => $heldCarts,
        ]);
    }

    /**
     * store
     *
     * @param  mixed $request
     * @return void
     */
    public function store(Request $request, PaymentGatewayManager $paymentGatewayManager)
    {
        $authenticatedUser = $request->user();
        $paymentGateway = $request->input('payment_gateway');
        if ($paymentGateway) {
            $paymentGateway = strtolower($paymentGateway);
        }
        $paymentSetting = null;
        $isManualPayment = in_array($paymentGateway, self::MANUAL_PAYMENT_METHODS, true);

        if ($paymentGateway && ! $isManualPayment) {
            $paymentSetting = PaymentSetting::first();

            if (! $paymentSetting || ! $paymentSetting->isGatewayReady($paymentGateway)) {
                return redirect()
                    ->route('transactions.index')
                    ->with('error', 'Gateway pembayaran belum dikonfigurasi.');
            }
        }

        $length = 10;
        $random = '';
        for ($i = 0; $i < $length; $i++) {
            $random .= rand(0, 1) ? rand(0, 9) : chr(rand(ord('a'), ord('z')));
        }

        $invoice        = 'TRX-' . Str::upper($random);
        $isCashPayment  = empty($paymentGateway);
        $isPaidDirectly = $isCashPayment || $isManualPayment;
        $cashAmount     = $isCashPayment ? $request->cash : $request->grand_total;
        $changeAmount   = $isPaidDirectly ? $request->change : 0;
        $isCustomerOrder = $authenticatedUser?->isCustomer() ?? false;
        $cashierId = $isCustomerOrder
            ? $this->resolveCompanyCashierId()
            : $authenticatedUser->id;

        $transaction = DB::transaction(function () use (
            $request,
            $invoice,
            $cashAmount,
            $changeAmount,
            $paymentGateway,
            $isCashPayment,
            $isPaidDirectly,
            $cashierId,
            $authenticatedUser,
            $isCustomerOrder
        ) {
            $transaction = Transaction::create([
                'cashier_id'     => $cashierId,
                'customer_id'    => $request->customer_id,
                'ordered_by_user_id' => $authenticatedUser->id,
                'order_source'   => $isCustomerOrder ? 'customer' : 'cashier',
                'invoice'        => $invoice,
                'cash'           => $cashAmount,
                'change'         => $changeAmount,
                'discount'       => $request->discount,
                'grand_total'    => $request->grand_total,
                'payment_method' => $paymentGateway ?: 'cash',
                'payment_status' => $isPaidDirectly ? 'paid' : 'pending',
            ]);

            $carts = Cart::where('cashier_id', auth()->user()->id)->get();

            foreach ($carts as $cart) {
                $transaction->details()->create([
                    'transaction_id' => $transaction->id,
                    'product_id'     => $cart->product_id,
                    'qty'            => $cart->qty,
                    'price'          => $cart->price,
                ]);

                $total_buy_price  = $cart->product->buy_price * $cart->qty;
                $total_sell_price = $cart->product->sell_price * $cart->qty;
                $profits          = $total_sell_price - $total_buy_price;

                $transaction->profits()->create([
                    'transaction_id' => $transaction->id,
                    'total'          => $profits,
                ]);

                $product        = Product::find($cart->product_id);
                $product->stock = $product->stock - $cart->qty;
                $product->save();
            }

            Cart::where('cashier_id', auth()->user()->id)->delete();

            return $transaction->fresh(['customer']);
        });

        if ($paymentGateway === PaymentSetting::GATEWAY_WHATSAPP) {
            $whatsAppUrl = $this->buildWhatsAppOrderUrl($transaction);

            if ($whatsAppUrl) {
                $transaction->update([
                    'payment_url' => $whatsAppUrl,
                ]);
            }
        }

        if ($paymentGateway && ! $isManualPayment) {
            try {
                $paymentResponse = $paymentGatewayManager->createPayment($transaction, $paymentGateway, $paymentSetting);

                $transaction->update([
                    'payment_reference' => $paymentResponse['reference'] ?? null,
                    'payment_url'       => $paymentResponse['payment_url'] ?? null,
                ]);
            } catch (PaymentGatewayException $exception) {
                return redirect()
                    ->route('transactions.print', $transaction->invoice)
                    ->with('error', $exception->getMessage());
            }
        }

        return to_route('transactions.print', $transaction->invoice);
    }

    public function print($invoice)
    {
        //get transaction
        $transaction = Transaction::with('details.product', 'cashier', 'customer')->where('invoice', $invoice)->firstOrFail();

        return Inertia::render('Dashboard/Transactions/Print', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Display transaction history.
     */
    public function history(Request $request)
    {
        $filters = [
            'invoice'    => $request->input('invoice'),
            'start_date' => $request->input('start_date'),
            'end_date'   => $request->input('end_date'),
        ];

        $query = Transaction::query()
            ->with(['cashier:id,name', 'customer:id,name', 'orderedByUser:id,name'])
            ->withSum('details as total_items', 'qty')
            ->withSum('profits as total_profit', 'total')
            ->orderByDesc('created_at');

        if (! $request->user()->isSuperAdmin()) {
            $query->where(function (Builder $builder) use ($request) {
                $builder->where('cashier_id', $request->user()->id)
                    ->orWhere('order_source', 'customer');
            });
        }

        $query
            ->when($filters['invoice'], function (Builder $builder, $invoice) {
                $builder->where('invoice', 'like', '%' . $invoice . '%');
            })
            ->when($filters['start_date'], function (Builder $builder, $date) {
                $builder->whereDate('created_at', '>=', $date);
            })
            ->when($filters['end_date'], function (Builder $builder, $date) {
                $builder->whereDate('created_at', '<=', $date);
            });

        $transactions = $query->paginate(10)->withQueryString();

        return Inertia::render('Dashboard/Transactions/History', [
            'transactions' => $transactions,
            'filters'      => $filters,
        ]);
    }

    private function buildWhatsAppOrderUrl(Transaction $transaction): ?string
    {
        $paymentSetting = PaymentSetting::first();
        $phone = $this->normalizeWhatsAppNumber($paymentSetting?->whatsapp_company_number);

        if (! $phone) {
            return null;
        }

        $transaction->loadMissing(['details.product', 'customer', 'cashier']);

        $lines = [
            'Pesanan baru masuk',
            'Invoice: ' . $transaction->invoice,
            'Pelanggan: ' . ($transaction->customer?->name ?? 'Umum'),
            'Kasir: ' . ($transaction->cashier?->name ?? '-'),
            'Metode: Kirim ke WhatsApp',
            '',
            'Detail Pesanan:',
        ];

        foreach ($transaction->details as $detail) {
            $lines[] = sprintf(
                '- %s x%s (%s)',
                $detail->product?->title ?? 'Produk',
                $detail->qty,
                number_format((float) $detail->price, 0, ',', '.')
            );
        }

        $lines[] = '';
        $lines[] = 'Diskon: Rp' . number_format((float) $transaction->discount, 0, ',', '.');
        $lines[] = 'Total: Rp' . number_format((float) $transaction->grand_total, 0, ',', '.');

        return 'https://wa.me/' . $phone . '?text=' . rawurlencode(implode("\n", $lines));
    }

    private function resolveCompanyCashierId(): int
    {
        $cashier = \App\Models\User::role('cashier')->orderBy('id')->first();

        if ($cashier) {
            return $cashier->id;
        }

        $admin = \App\Models\User::role('super-admin')->orderBy('id')->first();

        if ($admin) {
            return $admin->id;
        }

        return auth()->id();
    }

    private function normalizeWhatsAppNumber(?string $number): ?string
    {
        if (! $number) {
            return null;
        }

        $normalized = preg_replace('/\D+/', '', $number);

        if (! $normalized) {
            return null;
        }

        if (str_starts_with($normalized, '0')) {
            return '62' . substr($normalized, 1);
        }

        if (! str_starts_with($normalized, '62')) {
            return '62' . ltrim($normalized, '0');
        }

        return $normalized;
    }
}

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
        // Validate input quantity and product existence
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty'        => 'required|integer|min:1',
        ]);

        // Cari produk berdasarkan ID yang diberikan
        $product = Product::whereId($request->product_id)->first();

        // Jika produk tidak ditemukan, redirect dengan pesan error
        if (! $product) {
            return redirect()->back()->withErrors(['qty' => 'Mebel tidak ditemukan.']);
        }

        // Cek stok produk awal
        if ($product->stock < $request->qty) {
            return redirect()->back()->withErrors(['qty' => "Stok untuk mebel '{$product->title}' tidak mencukupi. Tersedia: {$product->stock}."]);
        }

        // Cek keranjang
        $cart = Cart::with('product')
            ->where('product_id', $request->product_id)
            ->where('cashier_id', auth()->user()->id)
            ->first();

        if ($cart) {
            $newQty = $cart->qty + $request->qty;
            if ($product->stock < $newQty) {
                return redirect()->back()->withErrors(['qty' => "Kuantitas mebel '{$product->title}' di keranjang melebihi stok. Tersedia: {$product->stock}."]);
            }

            // Tingkatkan qty secara lokal tanpa memicu increment double save
            $cart->qty = $newQty;
            $cart->price = $cart->product->sell_price * $cart->qty;
            $cart->save();
        } else {
            // Insert ke keranjang
            Cart::create([
                'cashier_id' => auth()->user()->id,
                'product_id' => $request->product_id,
                'qty'        => $request->qty,
                'price'      => $product->sell_price * $request->qty,
            ]);
        }

        return redirect()->route('transactions.index')->with('success', 'Mebel berhasil ditambahkan ke keranjang.');
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
            return redirect()->back()->withErrors(['qty' => 'Item keranjang tidak ditemukan.']);
        }

        // Check stock availability
        if ($cart->product->stock < $request->qty) {
            return redirect()->back()->withErrors(['qty' => 'Stok tidak mencukupi. Tersedia: ' . $cart->product->stock]);
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
     * @return \Illuminate\Http\RedirectResponse
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
            return redirect()->back()->withErrors(['checkout' => 'Keranjang kosong, tidak ada yang bisa ditahan']);
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
     * @return \Illuminate\Http\RedirectResponse
     */
    public function resumeCart($holdId)
    {
        $userId = auth()->user()->id;

        // Check if there are any active carts (not held)
        $activeCarts = Cart::where('cashier_id', $userId)
            ->active()
            ->count();

        if ($activeCarts > 0) {
            return redirect()->back()->withErrors(['checkout' => 'Selesaikan atau tahan transaksi aktif terlebih dahulu']);
        }

        // Get held carts
        $heldCarts = Cart::where('cashier_id', $userId)
            ->forHold($holdId)
            ->get();

        if ($heldCarts->isEmpty()) {
            return redirect()->back()->withErrors(['checkout' => 'Transaksi ditahan tidak ditemukan']);
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
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clearHold($holdId)
    {
        $userId = auth()->user()->id;

        $deleted = Cart::where('cashier_id', $userId)
            ->forHold($holdId)
            ->delete();

        if ($deleted === 0) {
            return redirect()->back()->withErrors(['checkout' => 'Transaksi ditahan tidak ditemukan']);
        }

        return back()->with('success', 'Transaksi ditahan berhasil dihapus');
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

        // Validate request
        $request->validate([
            'discount' => 'required|integer|min:0',
        ]);

        $paymentGateway = $request->input('payment_gateway');
        $isCashPayment  = empty($paymentGateway);
        $isManualPayment = in_array($paymentGateway, self::MANUAL_PAYMENT_METHODS, true);

        // Fetch carts with products to calculate subtotal
        $carts = Cart::with('product')->where('cashier_id', auth()->user()->id)->get();
        if ($carts->isEmpty()) {
            return redirect()->back()->with('error', 'Keranjang belanja kosong.');
        }

        // Subtotal calculation
        $subtotal = 0;
        foreach ($carts as $cart) {
            $subtotal += $cart->product->sell_price * $cart->qty;
        }

        $discount = (int) $request->discount;
        $grandTotal = max(0, $subtotal - $discount);

        if ($isCashPayment) {
            $request->validate([
                'cash' => 'required|integer|min:' . $grandTotal,
            ]);
            $cashAmount = (int) $request->cash;
            $changeAmount = $cashAmount - $grandTotal;
        } else {
            $cashAmount = $grandTotal;
            $changeAmount = 0;
        }

        $length = 10;
        $random = '';
        for ($i = 0; $i < $length; $i++) {
            $random .= rand(0, 1) ? rand(0, 9) : chr(rand(ord('a'), ord('z')));
        }

        $invoice        = 'TRX-' . Str::upper($random);
        $isPaidDirectly = $isCashPayment || $isManualPayment;
        $isCustomerOrder = $authenticatedUser?->isCustomer() ?? false;
        $cashierId = $isCustomerOrder
            ? $this->resolveCompanyCashierId()
            : $authenticatedUser->id;

        try {
            $transaction = DB::transaction(function () use (
                $request,
                $invoice,
                $cashAmount,
                $changeAmount,
                $grandTotal,
                $discount,
                $paymentGateway,
                $isPaidDirectly,
                $cashierId,
                $authenticatedUser,
                $isCustomerOrder,
                $carts
            ) {
                $transaction = Transaction::create([
                    'cashier_id'     => $cashierId,
                    'customer_id'    => $request->customer_id,
                    'ordered_by_user_id' => $authenticatedUser->id,
                    'order_source'   => $isCustomerOrder ? 'customer' : 'cashier',
                    'invoice'        => $invoice,
                    'cash'           => $cashAmount,
                    'change'         => $changeAmount,
                    'discount'       => $discount,
                    'grand_total'    => $grandTotal,
                    'payment_method' => $paymentGateway ?: 'cash',
                    'payment_status' => $isPaidDirectly ? 'paid' : 'pending',
                ]);

                foreach ($carts as $cart) {
                    // Lock product row for update to prevent race conditions
                    $product = Product::where('id', $cart->product_id)->lockForUpdate()->first();

                    if (! $product) {
                        throw new \Exception("Produk tidak ditemukan.");
                    }

                    // Check stock
                    if ($product->stock < $cart->qty) {
                        throw new \Exception("Stok untuk mebel '{$product->title}' tidak mencukupi. Tersedia: {$product->stock}.");
                    }

                    $transaction->details()->create([
                        'transaction_id' => $transaction->id,
                        'product_id'     => $cart->product_id,
                        'qty'            => $cart->qty,
                        'price'          => $product->sell_price * $cart->qty,
                    ]);

                    $total_buy_price  = $product->buy_price * $cart->qty;
                    $total_sell_price = $product->sell_price * $cart->qty;
                    $profits          = $total_sell_price - $total_buy_price;

                    $transaction->profits()->create([
                        'transaction_id' => $transaction->id,
                        'total'          => $profits,
                    ]);
                }

                Cart::where('cashier_id', auth()->user()->id)->delete();

                return $transaction->fresh(['customer']);
            });
        } catch (\Exception $e) {
            return redirect()
                ->route('transactions.index')
                ->withErrors(['checkout' => $e->getMessage()]);
        }

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

    /**
     * validateTransaction - Validate pending transaction and decrement stock
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function validateTransaction($id)
    {
        $user = auth()->user();
        if (! $user || ! $user->hasAnyRole(['super-admin', 'cashier'])) {
            abort(403, 'Akses ditolak.');
        }

        $transaction = Transaction::find($id);
        if (! $transaction) {
            return redirect()->back()->withErrors(['checkout' => 'Transaksi tidak ditemukan.']);
        }

        if ($transaction->status !== 'pending') {
            return redirect()->back()->withErrors(['checkout' => "Transaksi ini sudah divalidasi atau diproses (Status: {$transaction->status})."]);
        }

        try {
            DB::transaction(function () use ($transaction) {
                // Fetch transaction with row lock
                $lockedTransaction = Transaction::where('id', $transaction->id)->lockForUpdate()->first();

                // Check all details and their product stocks
                foreach ($lockedTransaction->details as $detail) {
                    $product = Product::where('id', $detail->product_id)->lockForUpdate()->first();

                    if (! $product) {
                        throw new \Exception("Produk tidak ditemukan.");
                    }

                    if ($product->stock < $detail->qty) {
                        throw new \Exception("Validasi Gagal! Stok [{$product->title}] tidak mencukupi.");
                    }
                }

                // Decrement stock
                foreach ($lockedTransaction->details as $detail) {
                    $product = Product::where('id', $detail->product_id)->lockForUpdate()->first();
                    $product->decrement('stock', $detail->qty);
                }

                $lockedTransaction->update([
                    'status' => 'success',
                    'payment_status' => 'paid',
                ]);
            });

            return redirect()->back()->with('success', 'Transaksi Berhasil Divalidasi & Stok Telah Dipotong!');

        } catch (\Exception $e) {
            // Update status to rejected
            $transaction->update(['status' => 'rejected']);

            return redirect()->back()->withErrors(['checkout' => $e->getMessage()]);
        }
    }
}

<?php
namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Profit;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        Cart::truncate();
        TransactionDetail::truncate();
        Profit::truncate();
        Transaction::truncate();
        Product::truncate();
        Category::truncate();
        Customer::truncate();

        Schema::enableForeignKeyConstraints();

        $this->command->info('Seeding customers...');
        $customers = $this->seedCustomers();

        $this->command->info('Seeding categories...');
        $categories = $this->seedCategories();

        $this->command->info('Seeding products...');
        $products = $this->seedProducts($categories);

        $this->command->info('Seeding transactions...');
        $this->seedTransactions($customers, $products);

        $this->command->info('Sample data seeding completed!');
    }

    /**
     * Seed 15 pelanggan.
     */
    private function seedCustomers(): Collection
    {
        $customers = collect([
            ['name' => 'Andi Nugraha',      'no_telp' => '6281211111111', 'address' => 'Jl. Melati No. 21, Bandung'],
            ['name' => 'Bunga Maharani',    'no_telp' => '6281312345678', 'address' => 'Jl. Mawar No. 5, Jakarta'],
            ['name' => 'Cici Amelia',       'no_telp' => '6281512340000', 'address' => 'Jl. Anggrek No. 17, Surabaya'],
            ['name' => 'Davin Pradipta',    'no_telp' => '6285612349911', 'address' => 'Jl. Kenanga No. 2, Yogyakarta'],
            ['name' => 'Eko Saputra',       'no_telp' => '6287712348822', 'address' => 'Jl. Cemara No. 45, Semarang'],
            ['name' => 'Fitri Lestari',     'no_telp' => '6282213345566', 'address' => 'Jl. Sakura No. 7, Medan'],
            ['name' => 'Gina Putri',        'no_telp' => '6281399887766', 'address' => 'Jl. Dahlia No. 12, Malang'],
            ['name' => 'Hendra Wijaya',     'no_telp' => '6285544332211', 'address' => 'Jl. Flamboyan No. 8, Denpasar'],
            ['name' => 'Indah Permata',     'no_telp' => '6281298765432', 'address' => 'Jl. Teratai No. 3, Solo'],
            ['name' => 'Joko Susanto',      'no_telp' => '6287611223344', 'address' => 'Jl. Mangga No. 9, Jepara'],
            ['name' => 'Kartika Dewi',      'no_telp' => '6282134567890', 'address' => 'Jl. Melati No. 15, Kudus'],
            ['name' => 'Lukman Hakim',      'no_telp' => '6281334455667', 'address' => 'Jl. Palem No. 22, Demak'],
            ['name' => 'Maya Sari',         'no_telp' => '6285678901234', 'address' => 'Jl. Pandan No. 6, Pati'],
            ['name' => 'Nurul Hidayah',     'no_telp' => '6281256789012', 'address' => 'Jl. Rambutan No. 11, Rembang'],
            ['name' => 'Oscar Pratama',     'no_telp' => '6281978563412', 'address' => 'Jl. Nangka No. 4, Blora'],
        ]);

        return $customers
            ->map(fn($c) => Customer::create($c))
            ->keyBy('name');
    }

    /**
     * Seed 5 kategori mebel jepara.
     */
    private function seedCategories(): Collection
    {
        $categories = collect([
            ['name' => 'Kursi & Sofa',     'description' => 'Kursi tamu, kursi teras, dan sofa dari kayu jati solid khas Jepara'],
            ['name' => 'Meja',             'description' => 'Meja makan, coffee table, meja rias kayu jati solid Jepara'],
            ['name' => 'Lemari & Kabinet', 'description' => 'Lemari pakaian, buffet TV, dan rak kayu jati khas Jepara'],
            ['name' => 'Tempat Tidur',     'description' => 'Dipan minimalis dan dipan ukiran Jepara mewah dari kayu jati'],
            ['name' => 'Aksesori Rumah',   'description' => 'Cermin ukir, rak dinding, jam, dan dekorasi kayu jati Jepara'],
        ]);

        return $categories->map(function ($cat) {
            return Category::create([
                'name'        => $cat['name'],
                'description' => $cat['description'],
                'image'       => 'default.jpg',
            ]);
        })->keyBy('name');
    }

    /**
     * Seed 20 produk dari 5 kategori.
     */
    private function seedProducts(Collection $categories): Collection
    {
        $products = collect([
            // ── Kursi & Sofa (5 produk) ──────────────────────────────────────
            ['category' => 'Kursi & Sofa', 'barcode' => 'KRS-0001', 'title' => 'Kursi Tamu Jati Sudut',      'description' => 'Kursi sudut tamu bahan kayu jati solid, nyaman untuk ruang tamu keluarga',            'buy_price' => 3200000, 'sell_price' => 4500000, 'stock' => 12],
            ['category' => 'Kursi & Sofa', 'barcode' => 'KRS-0002', 'title' => 'Sofa Retro Minimalis',       'description' => 'Sofa retro jati minimalis dengan busa jok kenyal dan tahan lama',                      'buy_price' => 2500000, 'sell_price' => 3800000, 'stock' => 15],
            ['category' => 'Kursi & Sofa', 'barcode' => 'KRS-0003', 'title' => 'Kursi Teras Jati Mangkok',   'description' => 'Set kursi teras mangkok jati isi 2 kursi + 1 meja kecil, cocok untuk teras rumah',     'buy_price' => 1200000, 'sell_price' => 1800000, 'stock' => 20],
            ['category' => 'Kursi & Sofa', 'barcode' => 'KRS-0004', 'title' => 'Sofa L-Shape Jati Ukir',     'description' => 'Sofa model L bahan kayu jati dengan ukiran motif batik khas Jepara',                   'buy_price' => 7500000, 'sell_price' => 11000000,'stock' => 5],
            ['category' => 'Kursi & Sofa', 'barcode' => 'KRS-0005', 'title' => 'Kursi Makan Jati Polos',     'description' => 'Kursi makan kayu jati solid tanpa sandaran tangan, cocok dipadukan dengan meja makan', 'buy_price' => 450000,  'sell_price' => 700000,  'stock' => 40],

            // ── Meja (5 produk) ───────────────────────────────────────────────
            ['category' => 'Meja', 'barcode' => 'MJA-0001', 'title' => 'Meja Makan Jati 6 Kursi',  'description' => 'Meja makan jati ukuran besar set lengkap dengan 6 kursi berbusa empuk',         'buy_price' => 4500000, 'sell_price' => 6500000, 'stock' => 8],
            ['category' => 'Meja', 'barcode' => 'MJA-0002', 'title' => 'Coffee Table Jati Retro',   'description' => 'Meja kopi retro kayu jati solid, sangat serasi untuk ruang tamu minimalis',    'buy_price' => 900000,  'sell_price' => 1400000, 'stock' => 25],
            ['category' => 'Meja', 'barcode' => 'MJA-0003', 'title' => 'Meja Rias Jati Kartini',    'description' => 'Meja rias jati model klasik dilengkapi cermin oval besar cantik dan elegan',    'buy_price' => 2100000, 'sell_price' => 3200000, 'stock' => 10],
            ['category' => 'Meja', 'barcode' => 'MJA-0004', 'title' => 'Meja Makan Jati 4 Kursi',  'description' => 'Meja makan jati ukuran sedang set 4 kursi, cocok untuk keluarga kecil',         'buy_price' => 2800000, 'sell_price' => 4200000, 'stock' => 12],
            ['category' => 'Meja', 'barcode' => 'MJA-0005', 'title' => 'Side Table Jati Bulat',     'description' => 'Meja samping bulat kayu jati solid, cocok di samping sofa atau ranjang tidur',  'buy_price' => 450000,  'sell_price' => 700000,  'stock' => 30],

            // ── Lemari & Kabinet (4 produk) ───────────────────────────────────
            ['category' => 'Lemari & Kabinet', 'barcode' => 'LMR-0001', 'title' => 'Lemari Pakaian Jati 3 Pintu', 'description' => 'Lemari pakaian kayu jati minimalis modern 3 pintu, kokoh dan tahan lama',       'buy_price' => 5200000, 'sell_price' => 7500000, 'stock' => 6],
            ['category' => 'Lemari & Kabinet', 'barcode' => 'LMR-0002', 'title' => 'Buffet TV Jati Minimalis',    'description' => 'Kabinet TV kayu jati dengan laci penyimpanan serbaguna, desain minimalis',       'buy_price' => 1800000, 'sell_price' => 2700000, 'stock' => 14],
            ['category' => 'Lemari & Kabinet', 'barcode' => 'LMR-0003', 'title' => 'Rak Buku Jati Pembatas',      'description' => 'Rak buku jati model dua sisi multifungsi, bisa sebagai pembatas ruangan',         'buy_price' => 1400000, 'sell_price' => 2200000, 'stock' => 18],
            ['category' => 'Lemari & Kabinet', 'barcode' => 'LMR-0004', 'title' => 'Nakas Jati 1 Laci',           'description' => 'Meja nakas kayu jati dengan 1 laci penyimpanan, cocok untuk samping ranjang',     'buy_price' => 600000,  'sell_price' => 950000,  'stock' => 22],

            // ── Tempat Tidur (3 produk) ───────────────────────────────────────
            ['category' => 'Tempat Tidur', 'barcode' => 'TDR-0001', 'title' => 'Dipan Jati Minimalis Laci',   'description' => 'Dipan jati minimalis modern dengan laci sorong bawah untuk penyimpanan tambahan', 'buy_price' => 4100000, 'sell_price' => 5900000,  'stock' => 8],
            ['category' => 'Tempat Tidur', 'barcode' => 'TDR-0002', 'title' => 'Ranjang Jati 120x200 Anak',   'description' => 'Dipan kayu jati ukuran anak dengan pengaman samping dan laci penyimpanan',       'buy_price' => 2200000, 'sell_price' => 3300000,  'stock' => 10],
            ['category' => 'Tempat Tidur', 'barcode' => 'TDR-0003', 'title' => 'Dipan Ukiran Pengantin',      'description' => 'Dipan kayu jati ukiran khas pengantin Jepara, megah dan elegan untuk kamar utama', 'buy_price' => 8500000, 'sell_price' => 13000000, 'stock' => 3],

            // ── Aksesori Rumah (3 produk) ─────────────────────────────────────
            ['category' => 'Aksesori Rumah', 'barcode' => 'AKS-0001', 'title' => 'Cermin Ukir Oval Jati',    'description' => 'Cermin oval dengan bingkai kayu jati ukiran motif dedaunan khas Jepara',       'buy_price' => 800000,  'sell_price' => 1300000, 'stock' => 20],
            ['category' => 'Aksesori Rumah', 'barcode' => 'AKS-0002', 'title' => 'Rak Dinding Jati 3 Susun', 'description' => 'Rak dinding kayu jati 3 tingkat untuk dekorasi dan pajangan ruangan',          'buy_price' => 450000,  'sell_price' => 720000,  'stock' => 30],
            ['category' => 'Aksesori Rumah', 'barcode' => 'AKS-0003', 'title' => 'Jam Dinding Ukir Jati',    'description' => 'Jam dinding dengan bingkai kayu jati ukiran motif Jepara, aksen vintage unik',  'buy_price' => 350000,  'sell_price' => 580000,  'stock' => 25],
        ]);

        return $products->map(function ($product) use ($categories) {
            $category = $categories->get($product['category']);

            return Product::create([
                'category_id' => $category?->id,
                'image'       => 'default.jpg',
                'barcode'     => $product['barcode'],
                'title'       => $product['title'],
                'description' => $product['description'],
                'buy_price'   => $product['buy_price'],
                'sell_price'  => $product['sell_price'],
                'stock'       => $product['stock'],
            ]);
        })->keyBy('barcode');
    }

    /**
     * Seed 18 transaksi historis dengan berbagai skenario.
     */
    private function seedTransactions(Collection $customers, Collection $products): void
    {
        $cashier = User::where('email', 'cashier@gmail.com')->first() ?? User::first();

        if (! $cashier) {
            return;
        }

        $blueprints = [
            ['customer' => 'Andi Nugraha',   'discount' => 200000,  'cash' => 10000000, 'items' => [['barcode' => 'KRS-0001', 'qty' => 1], ['barcode' => 'MJA-0002', 'qty' => 2]]],
            ['customer' => 'Bunga Maharani', 'discount' => 0,       'cash' => 4000000,  'items' => [['barcode' => 'KRS-0002', 'qty' => 1]]],
            ['customer' => 'Cici Amelia',    'discount' => 100000,  'cash' => 3000000,  'items' => [['barcode' => 'LMR-0002', 'qty' => 1]]],
            ['customer' => 'Davin Pradipta', 'discount' => 0,       'cash' => 10000000, 'items' => [['barcode' => 'MJA-0001', 'qty' => 1], ['barcode' => 'KRS-0005', 'qty' => 4]]],
            ['customer' => 'Eko Saputra',    'discount' => 500000,  'cash' => 7000000,  'items' => [['barcode' => 'TDR-0001', 'qty' => 1]]],
            ['customer' => 'Fitri Lestari',  'discount' => 0,       'cash' => 8000000,  'items' => [['barcode' => 'LMR-0001', 'qty' => 1]]],
            ['customer' => 'Gina Putri',     'discount' => 0,       'cash' => 5000000,  'items' => [['barcode' => 'AKS-0001', 'qty' => 2], ['barcode' => 'AKS-0002', 'qty' => 3], ['barcode' => 'AKS-0003', 'qty' => 1]]],
            ['customer' => 'Hendra Wijaya',  'discount' => 1000000, 'cash' => 15000000, 'items' => [['barcode' => 'TDR-0001', 'qty' => 1], ['barcode' => 'LMR-0004', 'qty' => 2]]],
            ['customer' => 'Indah Permata',  'discount' => 0,       'cash' => 5000000,  'items' => [['barcode' => 'KRS-0003', 'qty' => 1], ['barcode' => 'LMR-0003', 'qty' => 1]]],
            ['customer' => 'Joko Susanto',   'discount' => 150000,  'cash' => 6000000,  'items' => [['barcode' => 'MJA-0003', 'qty' => 1], ['barcode' => 'AKS-0002', 'qty' => 2]]],
            ['customer' => 'Kartika Dewi',   'discount' => 500000,  'cash' => 12000000, 'items' => [['barcode' => 'KRS-0004', 'qty' => 1], ['barcode' => 'MJA-0005', 'qty' => 1]]],
            ['customer' => 'Lukman Hakim',   'discount' => 0,       'cash' => 4000000,  'items' => [['barcode' => 'TDR-0002', 'qty' => 1]]],
            ['customer' => 'Maya Sari',      'discount' => 200000,  'cash' => 8000000,  'items' => [['barcode' => 'MJA-0004', 'qty' => 1], ['barcode' => 'KRS-0005', 'qty' => 4], ['barcode' => 'MJA-0005', 'qty' => 1]]],
            ['customer' => 'Nurul Hidayah',  'discount' => 0,       'cash' => 5000000,  'items' => [['barcode' => 'KRS-0002', 'qty' => 1], ['barcode' => 'LMR-0002', 'qty' => 1]]],
            ['customer' => 'Oscar Pratama',  'discount' => 1000000, 'cash' => 15000000, 'items' => [['barcode' => 'TDR-0003', 'qty' => 1]]],
            ['customer' => 'Andi Nugraha',   'discount' => 0,       'cash' => 3000000,  'items' => [['barcode' => 'AKS-0001', 'qty' => 1], ['barcode' => 'AKS-0002', 'qty' => 2], ['barcode' => 'AKS-0003', 'qty' => 2]]],
            ['customer' => 'Bunga Maharani', 'discount' => 0,       'cash' => 3000000,  'items' => [['barcode' => 'LMR-0003', 'qty' => 1], ['barcode' => 'AKS-0001', 'qty' => 1]]],
            ['customer' => 'Cici Amelia',    'discount' => 100000,  'cash' => 4000000,  'items' => [['barcode' => 'KRS-0001', 'qty' => 1], ['barcode' => 'KRS-0003', 'qty' => 1]]],
        ];

        foreach ($blueprints as $blueprint) {
            $customer = $customers->get($blueprint['customer']);

            $items = collect($blueprint['items'])
                ->map(function ($item) use ($products) {
                    $product = $products->get($item['barcode']);

                    if (! $product) {
                        return null;
                    }

                    if ($product->stock < $item['qty']) {
                        $item['qty'] = max(1, $product->stock);
                    }

                    return [
                        'product'    => $product,
                        'qty'        => $item['qty'],
                        'line_total' => $product->sell_price * $item['qty'],
                        'profit'     => ($product->sell_price - $product->buy_price) * $item['qty'],
                    ];
                })
                ->filter();

            if ($items->isEmpty()) {
                continue;
            }

            $discount   = max(0, $blueprint['discount']);
            $gross      = $items->sum('line_total');
            $grandTotal = max(0, $gross - $discount);
            $cashPaid   = max($grandTotal, $blueprint['cash']);
            $change     = $cashPaid - $grandTotal;

            $transaction = Transaction::create([
                'cashier_id'  => $cashier->id,
                'customer_id' => $customer?->id,
                'invoice'     => 'TRX-' . Str::upper(Str::random(8)),
                'cash'        => $cashPaid,
                'change'      => $change,
                'discount'    => $discount,
                'grand_total' => $grandTotal,
                'status'      => 'success',
            ]);

            foreach ($items as $item) {
                $transaction->details()->create([
                    'product_id' => $item['product']->id,
                    'qty'        => $item['qty'],
                    'price'      => $item['line_total'],
                ]);

                $transaction->profits()->create([
                    'total' => $item['profit'],
                ]);

                $item['product']->decrement('stock', $item['qty']);
            }
        }
    }
}

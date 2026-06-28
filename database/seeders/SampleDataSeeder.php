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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
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

        // Ensure storage directories exist
        Storage::disk('public')->makeDirectory('category');
        Storage::disk('public')->makeDirectory('products');

        $this->command->info('Seeding customers...');
        $customers = $this->seedCustomers();

        $this->command->info('Seeding categories with images...');
        $categories = $this->seedCategories();

        $this->command->info('Seeding products with images...');
        $products = $this->seedProducts($categories);

        $this->command->info('Seeding transactions...');
        $this->seedTransactions($customers, $products);

        $this->command->info('Sample data seeding completed!');
    }

    /**
     * Download image from URL and save to storage
     */
    private function downloadImage(string $url, string $folder, string $filename): ?string
    {
        try {
            $this->command->info("  Downloading: {$filename}...");

            $response = Http::timeout(30)->get($url);

            if ($response->successful()) {
                $extension    = 'jpg';
                $fullFilename = $filename . '.' . $extension;

                Storage::disk('public')->put(
                    $folder . '/' . $fullFilename,
                    $response->body()
                );

                return $fullFilename;
            }
        } catch (\Exception $e) {
            $this->command->warn("  Failed to download {$filename}: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Seed master customers.
     */
    private function seedCustomers(): Collection
    {
        $customers = collect([
            ['name' => 'Andi Nugraha', 'no_telp' => '6281211111111', 'address' => 'Jl. Melati No. 21, Bandung'],
            ['name' => 'Bunga Maharani', 'no_telp' => '6281312345678', 'address' => 'Jl. Mawar No. 5, Jakarta'],
            ['name' => 'Cici Amelia', 'no_telp' => '6281512340000', 'address' => 'Jl. Anggrek No. 17, Surabaya'],
            ['name' => 'Davin Pradipta', 'no_telp' => '6285612349911', 'address' => 'Jl. Kenanga No. 2, Yogyakarta'],
            ['name' => 'Eko Saputra', 'no_telp' => '6287712348822', 'address' => 'Jl. Cemara No. 45, Semarang'],
            ['name' => 'Fitri Lestari', 'no_telp' => '6282213345566', 'address' => 'Jl. Sakura No. 7, Medan'],
            ['name' => 'Gina Putri', 'no_telp' => '6281399887766', 'address' => 'Jl. Dahlia No. 12, Malang'],
            ['name' => 'Hendra Wijaya', 'no_telp' => '6285544332211', 'address' => 'Jl. Flamboyan No. 8, Denpasar'],
        ]);

        return $customers
            ->map(fn($customer) => Customer::create($customer))
            ->keyBy('name');
    }

    /**
     * Seed master categories with downloaded images.
     */
    private function seedCategories(): Collection
    {
        $categories = collect([
            [
                'name'        => 'Kursi & Sofa',
                'description' => 'Kursi tamu, kursi teras, sofa minimalis dari kayu jati solid',
                'image_url'   => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
            ],
            [
                'name'        => 'Meja',
                'description' => 'Meja makan, coffee table, meja rias kayu jati solid',
                'image_url'   => 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&h=400&fit=crop',
            ],
            [
                'name'        => 'Lemari & Kabinet',
                'description' => 'Lemari pakaian, buffet TV, rak buku kayu jati jepara',
                'image_url'   => 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
            ],
            [
                'name'        => 'Tempat Tidur',
                'description' => 'Dipan jati minimalis dan dipan ukiran jepara mewah',
                'image_url'   => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop',
            ],
        ]);

        return $categories->map(function ($category) {
            $slug  = Str::slug($category['name']);
            $image = $this->downloadImage(
                $category['image_url'],
                'category',
                'cat-' . $slug
            );

            return Category::create([
                'name'        => $category['name'],
                'description' => $category['description'],
                'image'       => $image ?? 'default.jpg',
            ]);
        })->keyBy('name');
    }

    /**
     * Seed products mapped to categories with downloaded images.
     */
    private function seedProducts(Collection $categories): Collection
    {
        $products = collect([
            // Kursi & Sofa
            [
                'category' => 'Kursi & Sofa',
                'barcode' => 'KRS-0001',
                'title' => 'Kursi Tamu Jati Sudut',
                'description' => 'Kursi sudut tamu bahan kayu jati solid formasi nyaman untuk keluarga',
                'buy_price' => 3200000,
                'sell_price' => 4500000,
                'stock' => 12,
                'image_url' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
            ],
            [
                'category' => 'Kursi & Sofa',
                'barcode' => 'KRS-0002',
                'title' => 'Sofa Retro Minimalis',
                'description' => 'Sofa retro jati minimalis dengan busa jok kenyal awet premium',
                'buy_price' => 2500000,
                'sell_price' => 3800000,
                'stock' => 15,
                'image_url' => 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=300&fit=crop',
            ],
            [
                'category' => 'Kursi & Sofa',
                'barcode' => 'KRS-0003',
                'title' => 'Kursi Teras Jati Mangkok',
                'description' => 'Set kursi teras mangkok jati isi 2 kursi dan 1 meja kecil mungil',
                'buy_price' => 1200000,
                'sell_price' => 1800000,
                'stock' => 20,
                'image_url' => 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop',
            ],

            // Meja
            [
                'category' => 'Meja',
                'barcode' => 'MJA-0001',
                'title' => 'Meja Makan Jati 6 Kursi',
                'description' => 'Meja makan jati ukuran besar lengkap dengan 6 kursi makan berbusa empuk',
                'buy_price' => 4500000,
                'sell_price' => 6500000,
                'stock' => 8,
                'image_url' => 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=300&h=300&fit=crop',
            ],
            [
                'category' => 'Meja',
                'barcode' => 'MJA-0002',
                'title' => 'Coffee Table Jati Retro',
                'description' => 'Meja kopi retro bahan kayu jati solid sangat serasi untuk ruang tamu',
                'buy_price' => 900000,
                'sell_price' => 1400000,
                'stock' => 25,
                'image_url' => 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300&h=300&fit=crop',
            ],
            [
                'category' => 'Meja',
                'barcode' => 'MJA-0003',
                'title' => 'Meja Rias Jati Kartini',
                'description' => 'Meja rias jati model klasik Kartini dilengkapi cermin oval besar cantik',
                'buy_price' => 2100000,
                'sell_price' => 3200000,
                'stock' => 10,
                'image_url' => 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=300&fit=crop',
            ],

            // Lemari & Kabinet
            [
                'category' => 'Lemari & Kabinet',
                'barcode' => 'LMR-0001',
                'title' => 'Lemari Pakaian Jati 3 Pintu',
                'description' => 'Lemari pakaian kayu jati model minimalis modern 3 pintu kokoh',
                'buy_price' => 5200000,
                'sell_price' => 7500000,
                'stock' => 6,
                'image_url' => 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=300&fit=crop',
            ],
            [
                'category' => 'Lemari & Kabinet',
                'barcode' => 'LMR-0002',
                'title' => 'Buffet TV Jati Minimalis',
                'description' => 'Rak kabinet TV bahan kayu jati dengan laci penyimpanan serbaguna luas',
                'buy_price' => 1800000,
                'sell_price' => 2700000,
                'stock' => 14,
                'image_url' => 'https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=300&h=300&fit=crop',
            ],
            [
                'category' => 'Lemari & Kabinet',
                'barcode' => 'LMR-0003',
                'title' => 'Rak Buku Jati Pembatas',
                'description' => 'Rak buku jati model sekat dua sisi multifungsi pembatas ruangan',
                'buy_price' => 1400000,
                'sell_price' => 2200000,
                'stock' => 18,
                'image_url' => 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=300&h=300&fit=crop',
            ],

            // Tempat Tidur
            [
                'category' => 'Tempat Tidur',
                'barcode' => 'TDR-0001',
                'title' => 'Dipan Jati Rahwana 180x200',
                'description' => 'Rangka tempat tidur dipan jati ukiran Rahwana mewah khas jepara',
                'buy_price' => 3800000,
                'sell_price' => 5500000,
                'stock' => 5,
                'image_url' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop',
            ],
            [
                'category' => 'Tempat Tidur',
                'barcode' => 'TDR-0002',
                'title' => 'Dipan Minimalis Jati Laci',
                'description' => 'Dipan jati minimalis modern dengan laci sorong bawah penyimpanan praktis',
                'buy_price' => 4100000,
                'sell_price' => 5900000,
                'stock' => 8,
                'image_url' => 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=300&h=300&fit=crop',
            ],
        ]);

        return $products->map(function ($product) use ($categories) {
            $category = $categories->get($product['category']);

            $slug  = Str::slug($product['title']);
            $image = $this->downloadImage(
                $product['image_url'],
                'products',
                'prod-' . $slug
            );

            return Product::create([
                'category_id' => $category?->id,
                'image'       => $image ?? 'default.jpg',
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
     * Seed historical transactions, transaction details, and profits.
     */
    private function seedTransactions(Collection $customers, Collection $products): void
    {
        $cashier = User::where('email', 'cashier@gmail.com')->first() ?? User::first();

        if (! $cashier) {
            return;
        }

        $blueprints = [
            [
                'customer' => 'Andi Nugraha',
                'discount' => 200000,
                'cash'     => 10000000,
                'items'    => [
                    ['barcode' => 'KRS-0001', 'qty' => 1],
                    ['barcode' => 'MJA-0002', 'qty' => 2],
                ],
            ],
            [
                'customer' => 'Bunga Maharani',
                'discount' => 0,
                'cash'     => 4000000,
                'items'    => [
                    ['barcode' => 'KRS-0002', 'qty' => 1],
                ],
            ],
            [
                'customer' => 'Cici Amelia',
                'discount' => 100000,
                'cash'     => 3000000,
                'items'    => [
                    ['barcode' => 'LMR-0002', 'qty' => 1],
                ],
            ],
        ];

        foreach ($blueprints as $blueprint) {
            $customer = $blueprint['customer']
                ? $customers->get($blueprint['customer'])
                : null;

            $items = collect($blueprint['items'])
                ->map(function ($item) use ($products) {
                    $product = $products->get($item['barcode']);

                    if (! $product) {
                        return null;
                    }

                    $lineTotal = $product->sell_price * $item['qty'];

                    return [
                        'product'    => $product,
                        'qty'        => $item['qty'],
                        'line_total' => $lineTotal,
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

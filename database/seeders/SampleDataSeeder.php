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
     * Seed master customers (15 pelanggan).
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
            [
                'name'        => 'Meja Tulis & Belajar',
                'description' => 'Meja kerja, meja belajar, dan kursi ergonomis dari kayu jati',
                'image_url'   => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop',
            ],
            [
                'name'        => 'Aksesori & Dekorasi',
                'description' => 'Cermin ukir, rak dinding, dan hiasan rumah dari kayu jati',
                'image_url'   => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
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
     * Total: 33 produk dari 6 kategori
     */
    private function seedProducts(Collection $categories): Collection
    {
        $products = collect([
            // ── Kursi & Sofa (8 produk) ──────────────────────────────────────
            [
                'category'   => 'Kursi & Sofa',
                'barcode'    => 'KRS-0001',
                'title'      => 'Kursi Tamu Jati Sudut',
                'description'=> 'Kursi sudut tamu bahan kayu jati solid formasi nyaman untuk keluarga',
                'buy_price'  => 3200000,
                'sell_price' => 4500000,
                'stock'      => 12,
                'image_url'  => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Kursi & Sofa',
                'barcode'    => 'KRS-0002',
                'title'      => 'Sofa Retro Minimalis',
                'description'=> 'Sofa retro jati minimalis dengan busa jok kenyal awet premium',
                'buy_price'  => 2500000,
                'sell_price' => 3800000,
                'stock'      => 15,
                'image_url'  => 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Kursi & Sofa',
                'barcode'    => 'KRS-0003',
                'title'      => 'Kursi Teras Jati Mangkok',
                'description'=> 'Set kursi teras mangkok jati isi 2 kursi dan 1 meja kecil mungil',
                'buy_price'  => 1200000,
                'sell_price' => 1800000,
                'stock'      => 20,
                'image_url'  => 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Kursi & Sofa',
                'barcode'    => 'KRS-0004',
                'title'      => 'Sofa L-Shape Jati Ukir',
                'description'=> 'Sofa model L bahan kayu jati dengan ukiran motif batik jepara mewah',
                'buy_price'  => 7500000,
                'sell_price' => 11000000,
                'stock'      => 5,
                'image_url'  => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Kursi & Sofa',
                'barcode'    => 'KRS-0005',
                'title'      => 'Kursi Makan Jati Polos',
                'description'=> 'Kursi makan kayu jati solid tanpa sandaran tangan, cocok set meja makan',
                'buy_price'  => 450000,
                'sell_price' => 700000,
                'stock'      => 40,
                'image_url'  => 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Kursi & Sofa',
                'barcode'    => 'KRS-0006',
                'title'      => 'Kursi Malas Goyang Jati',
                'description'=> 'Kursi santai goyang dari kayu jati pilihan, nyaman untuk relaksasi',
                'buy_price'  => 1500000,
                'sell_price' => 2200000,
                'stock'      => 10,
                'image_url'  => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Kursi & Sofa',
                'barcode'    => 'KRS-0007',
                'title'      => 'Sofa Minimalis 2 Dudukan',
                'description'=> 'Sofa 2 seat minimalis modern dengan rangka kayu jati dan kain beludru',
                'buy_price'  => 1800000,
                'sell_price' => 2700000,
                'stock'      => 8,
                'image_url'  => 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Kursi & Sofa',
                'barcode'    => 'KRS-0008',
                'title'      => 'Ottoman Jati Serbaguna',
                'description'=> 'Bangku ottoman kayu jati multifungsi bisa untuk kursi dan meja tamu',
                'buy_price'  => 600000,
                'sell_price' => 950000,
                'stock'      => 25,
                'image_url'  => 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop',
            ],

            // ── Meja (6 produk) ──────────────────────────────────────────────
            [
                'category'   => 'Meja',
                'barcode'    => 'MJA-0001',
                'title'      => 'Meja Makan Jati 6 Kursi',
                'description'=> 'Meja makan jati ukuran besar lengkap dengan 6 kursi makan berbusa empuk',
                'buy_price'  => 4500000,
                'sell_price' => 6500000,
                'stock'      => 8,
                'image_url'  => 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Meja',
                'barcode'    => 'MJA-0002',
                'title'      => 'Coffee Table Jati Retro',
                'description'=> 'Meja kopi retro bahan kayu jati solid sangat serasi untuk ruang tamu',
                'buy_price'  => 900000,
                'sell_price' => 1400000,
                'stock'      => 25,
                'image_url'  => 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Meja',
                'barcode'    => 'MJA-0003',
                'title'      => 'Meja Rias Jati Kartini',
                'description'=> 'Meja rias jati model klasik Kartini dilengkapi cermin oval besar cantik',
                'buy_price'  => 2100000,
                'sell_price' => 3200000,
                'stock'      => 10,
                'image_url'  => 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Meja',
                'barcode'    => 'MJA-0004',
                'title'      => 'Meja Makan Jati 4 Kursi',
                'description'=> 'Meja makan jati ukuran sedang set 4 kursi, cocok untuk keluarga kecil',
                'buy_price'  => 2800000,
                'sell_price' => 4200000,
                'stock'      => 12,
                'image_url'  => 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Meja',
                'barcode'    => 'MJA-0005',
                'title'      => 'Side Table Jati Bulat',
                'description'=> 'Meja samping bulat kayu jati solid, cocok di samping sofa atau tempat tidur',
                'buy_price'  => 450000,
                'sell_price' => 700000,
                'stock'      => 30,
                'image_url'  => 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Meja',
                'barcode'    => 'MJA-0006',
                'title'      => 'Meja Konsol Jati Ukir',
                'description'=> 'Meja konsol kayu jati ukiran khas jepara untuk ruang tamu atau lorong',
                'buy_price'  => 1600000,
                'sell_price' => 2500000,
                'stock'      => 7,
                'image_url'  => 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300&h=300&fit=crop',
            ],

            // ── Lemari & Kabinet (6 produk) ──────────────────────────────────
            [
                'category'   => 'Lemari & Kabinet',
                'barcode'    => 'LMR-0001',
                'title'      => 'Lemari Pakaian Jati 3 Pintu',
                'description'=> 'Lemari pakaian kayu jati model minimalis modern 3 pintu kokoh',
                'buy_price'  => 5200000,
                'sell_price' => 7500000,
                'stock'      => 6,
                'image_url'  => 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Lemari & Kabinet',
                'barcode'    => 'LMR-0002',
                'title'      => 'Buffet TV Jati Minimalis',
                'description'=> 'Rak kabinet TV bahan kayu jati dengan laci penyimpanan serbaguna luas',
                'buy_price'  => 1800000,
                'sell_price' => 2700000,
                'stock'      => 14,
                'image_url'  => 'https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Lemari & Kabinet',
                'barcode'    => 'LMR-0003',
                'title'      => 'Rak Buku Jati Pembatas',
                'description'=> 'Rak buku jati model sekat dua sisi multifungsi pembatas ruangan',
                'buy_price'  => 1400000,
                'sell_price' => 2200000,
                'stock'      => 18,
                'image_url'  => 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Lemari & Kabinet',
                'barcode'    => 'LMR-0004',
                'title'      => 'Lemari Pakaian Jati 2 Pintu',
                'description'=> 'Lemari pakaian 2 pintu dari kayu jati solid pilihan, model elegan minimalis',
                'buy_price'  => 3500000,
                'sell_price' => 5200000,
                'stock'      => 9,
                'image_url'  => 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Lemari & Kabinet',
                'barcode'    => 'LMR-0005',
                'title'      => 'Nakas Jati 1 Laci',
                'description'=> 'Meja nakas kayu jati dengan 1 laci penyimpanan, cocok untuk samping tempat tidur',
                'buy_price'  => 600000,
                'sell_price' => 950000,
                'stock'      => 22,
                'image_url'  => 'https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Lemari & Kabinet',
                'barcode'    => 'LMR-0006',
                'title'      => 'Rak Dapur Gantung Jati',
                'description'=> 'Rak dinding dapur dari kayu jati solid untuk menyimpan perabot dapur',
                'buy_price'  => 800000,
                'sell_price' => 1250000,
                'stock'      => 16,
                'image_url'  => 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=300&h=300&fit=crop',
            ],

            // ── Tempat Tidur (5 produk) ───────────────────────────────────────
            [
                'category'   => 'Tempat Tidur',
                'barcode'    => 'TDR-0001',
                'title'      => 'Dipan Jati Rahwana 180x200',
                'description'=> 'Rangka tempat tidur dipan jati ukiran Rahwana mewah khas jepara',
                'buy_price'  => 3800000,
                'sell_price' => 5500000,
                'stock'      => 5,
                'image_url'  => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Tempat Tidur',
                'barcode'    => 'TDR-0002',
                'title'      => 'Dipan Minimalis Jati Laci',
                'description'=> 'Dipan jati minimalis modern dengan laci sorong bawah penyimpanan praktis',
                'buy_price'  => 4100000,
                'sell_price' => 5900000,
                'stock'      => 8,
                'image_url'  => 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Tempat Tidur',
                'barcode'    => 'TDR-0003',
                'title'      => 'Ranjang Jati 120x200 Anak',
                'description'=> 'Dipan kayu jati ukuran anak dengan pengaman samping dan laci penyimpanan',
                'buy_price'  => 2200000,
                'sell_price' => 3300000,
                'stock'      => 10,
                'image_url'  => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Tempat Tidur',
                'barcode'    => 'TDR-0004',
                'title'      => 'Dipan Jati Ukiran Pengantin',
                'description'=> 'Dipan kayu jati ukiran khas pengantin jepara, megah dan elegan untuk kamar utama',
                'buy_price'  => 8500000,
                'sell_price' => 13000000,
                'stock'      => 3,
                'image_url'  => 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Tempat Tidur',
                'barcode'    => 'TDR-0005',
                'title'      => 'Headboard Jati Minimalis',
                'description'=> 'Sandaran kepala tempat tidur dari kayu jati pilihan, minimalis dan elegan',
                'buy_price'  => 900000,
                'sell_price' => 1400000,
                'stock'      => 15,
                'image_url'  => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop',
            ],

            // ── Meja Tulis & Belajar (4 produk) ─────────────────────────────
            [
                'category'   => 'Meja Tulis & Belajar',
                'barcode'    => 'MTB-0001',
                'title'      => 'Meja Belajar Jati L-Shape',
                'description'=> 'Meja belajar/kerja model L dari kayu jati dengan rak bertingkat di atas meja',
                'buy_price'  => 2200000,
                'sell_price' => 3300000,
                'stock'      => 10,
                'image_url'  => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Meja Tulis & Belajar',
                'barcode'    => 'MTB-0002',
                'title'      => 'Kursi Belajar Ergonomis Jati',
                'description'=> 'Kursi belajar ergonomis rangka kayu jati dengan busa dudukan tebal nyaman',
                'buy_price'  => 750000,
                'sell_price' => 1150000,
                'stock'      => 20,
                'image_url'  => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Meja Tulis & Belajar',
                'barcode'    => 'MTB-0003',
                'title'      => 'Meja Kerja Jati 1 Laci',
                'description'=> 'Meja kerja kayu jati model klasik dengan 1 laci penyimpanan bawah meja',
                'buy_price'  => 1400000,
                'sell_price' => 2100000,
                'stock'      => 15,
                'image_url'  => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Meja Tulis & Belajar',
                'barcode'    => 'MTB-0004',
                'title'      => 'Rak Atas Meja Belajar',
                'description'=> 'Rak susun di atas meja dari kayu jati, untuk buku dan alat tulis',
                'buy_price'  => 350000,
                'sell_price' => 550000,
                'stock'      => 35,
                'image_url'  => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&h=300&fit=crop',
            ],

            // ── Aksesori & Dekorasi (4 produk) ───────────────────────────────
            [
                'category'   => 'Aksesori & Dekorasi',
                'barcode'    => 'AKS-0001',
                'title'      => 'Cermin Ukir Oval Jati',
                'description'=> 'Cermin oval dengan bingkai kayu jati ukiran motif dedaunan khas jepara',
                'buy_price'  => 800000,
                'sell_price' => 1300000,
                'stock'      => 20,
                'image_url'  => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Aksesori & Dekorasi',
                'barcode'    => 'AKS-0002',
                'title'      => 'Rak Dinding Jati 3 Susun',
                'description'=> 'Rak dinding kayu jati 3 tingkat untuk dekorasi ruangan dan pajangan',
                'buy_price'  => 450000,
                'sell_price' => 720000,
                'stock'      => 30,
                'image_url'  => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Aksesori & Dekorasi',
                'barcode'    => 'AKS-0003',
                'title'      => 'Jam Dinding Ukir Jati',
                'description'=> 'Jam dinding dengan bingkai kayu jati ukiran motif jepara, aksen vintage elegan',
                'buy_price'  => 350000,
                'sell_price' => 580000,
                'stock'      => 25,
                'image_url'  => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
            ],
            [
                'category'   => 'Aksesori & Dekorasi',
                'barcode'    => 'AKS-0004',
                'title'      => 'Vas Bunga Ukir Jati',
                'description'=> 'Vas bunga kayu jati ukiran bermotif bunga khas jepara untuk dekorasi',
                'buy_price'  => 250000,
                'sell_price' => 400000,
                'stock'      => 40,
                'image_url'  => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
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
     * Total: 18 transaksi dengan berbagai skenario untuk blackbox testing
     */
    private function seedTransactions(Collection $customers, Collection $products): void
    {
        $cashier = User::where('email', 'cashier@gmail.com')->first() ?? User::first();

        if (! $cashier) {
            return;
        }

        $blueprints = [
            // ── Transaksi 1: Beli sofa + coffee table, bayar pas ──────────────
            [
                'customer' => 'Andi Nugraha',
                'discount' => 200000,
                'cash'     => 10000000,
                'items'    => [
                    ['barcode' => 'KRS-0001', 'qty' => 1],
                    ['barcode' => 'MJA-0002', 'qty' => 2],
                ],
            ],
            // ── Transaksi 2: Beli sofa retro, bayar pas ───────────────────────
            [
                'customer' => 'Bunga Maharani',
                'discount' => 0,
                'cash'     => 4000000,
                'items'    => [
                    ['barcode' => 'KRS-0002', 'qty' => 1],
                ],
            ],
            // ── Transaksi 3: Beli buffet TV, ada diskon ───────────────────────
            [
                'customer' => 'Cici Amelia',
                'discount' => 100000,
                'cash'     => 3000000,
                'items'    => [
                    ['barcode' => 'LMR-0002', 'qty' => 1],
                ],
            ],
            // ── Transaksi 4: Beli meja makan besar + 4 kursi makan ───────────
            [
                'customer' => 'Davin Pradipta',
                'discount' => 0,
                'cash'     => 10000000,
                'items'    => [
                    ['barcode' => 'MJA-0001', 'qty' => 1],
                    ['barcode' => 'KRS-0005', 'qty' => 4],
                ],
            ],
            // ── Transaksi 5: Beli dipan mewah, bayar lebih ────────────────────
            [
                'customer' => 'Eko Saputra',
                'discount' => 500000,
                'cash'     => 15000000,
                'items'    => [
                    ['barcode' => 'TDR-0001', 'qty' => 1],
                ],
            ],
            // ── Transaksi 6: Beli lemari 3 pintu ─────────────────────────────
            [
                'customer' => 'Fitri Lestari',
                'discount' => 0,
                'cash'     => 8000000,
                'items'    => [
                    ['barcode' => 'LMR-0001', 'qty' => 1],
                ],
            ],
            // ── Transaksi 7: Beli aksesori dekorasi banyak ───────────────────
            [
                'customer' => 'Gina Putri',
                'discount' => 0,
                'cash'     => 5000000,
                'items'    => [
                    ['barcode' => 'AKS-0001', 'qty' => 2],
                    ['barcode' => 'AKS-0002', 'qty' => 3],
                    ['barcode' => 'AKS-0003', 'qty' => 1],
                ],
            ],
            // ── Transaksi 8: Beli set kamar tidur lengkap ─────────────────────
            [
                'customer' => 'Hendra Wijaya',
                'discount' => 1000000,
                'cash'     => 20000000,
                'items'    => [
                    ['barcode' => 'TDR-0002', 'qty' => 1],
                    ['barcode' => 'LMR-0004', 'qty' => 1],
                    ['barcode' => 'LMR-0005', 'qty' => 2],
                ],
            ],
            // ── Transaksi 9: Beli kursi + rak buku ───────────────────────────
            [
                'customer' => 'Indah Permata',
                'discount' => 0,
                'cash'     => 5000000,
                'items'    => [
                    ['barcode' => 'KRS-0006', 'qty' => 1],
                    ['barcode' => 'LMR-0003', 'qty' => 1],
                ],
            ],
            // ── Transaksi 10: Beli meja belajar + kursi + rak ────────────────
            [
                'customer' => 'Joko Susanto',
                'discount' => 150000,
                'cash'     => 6000000,
                'items'    => [
                    ['barcode' => 'MTB-0001', 'qty' => 1],
                    ['barcode' => 'MTB-0002', 'qty' => 1],
                    ['barcode' => 'MTB-0004', 'qty' => 2],
                ],
            ],
            // ── Transaksi 11: Beli sofa L + meja konsol ──────────────────────
            [
                'customer' => 'Kartika Dewi',
                'discount' => 500000,
                'cash'     => 15000000,
                'items'    => [
                    ['barcode' => 'KRS-0004', 'qty' => 1],
                    ['barcode' => 'MJA-0006', 'qty' => 1],
                ],
            ],
            // ── Transaksi 12: Beli ranjang anak ──────────────────────────────
            [
                'customer' => 'Lukman Hakim',
                'discount' => 0,
                'cash'     => 4000000,
                'items'    => [
                    ['barcode' => 'TDR-0003', 'qty' => 1],
                ],
            ],
            // ── Transaksi 13: Beli set meja makan 4 kursi + side table ───────
            [
                'customer' => 'Maya Sari',
                'discount' => 200000,
                'cash'     => 8000000,
                'items'    => [
                    ['barcode' => 'MJA-0004', 'qty' => 1],
                    ['barcode' => 'KRS-0005', 'qty' => 4],
                    ['barcode' => 'MJA-0005', 'qty' => 1],
                ],
            ],
            // ── Transaksi 14: Beli sofa 2 dudukan + ottoman ───────────────────
            [
                'customer' => 'Nurul Hidayah',
                'discount' => 0,
                'cash'     => 5000000,
                'items'    => [
                    ['barcode' => 'KRS-0007', 'qty' => 1],
                    ['barcode' => 'KRS-0008', 'qty' => 2],
                ],
            ],
            // ── Transaksi 15: Beli dipan pengantin mewah ─────────────────────
            [
                'customer' => 'Oscar Pratama',
                'discount' => 1000000,
                'cash'     => 15000000,
                'items'    => [
                    ['barcode' => 'TDR-0004', 'qty' => 1],
                ],
            ],
            // ── Transaksi 16: Beli aksesori lengkap ───────────────────────────
            [
                'customer' => 'Andi Nugraha',
                'discount' => 0,
                'cash'     => 3000000,
                'items'    => [
                    ['barcode' => 'AKS-0001', 'qty' => 1],
                    ['barcode' => 'AKS-0002', 'qty' => 2],
                    ['barcode' => 'AKS-0003', 'qty' => 2],
                    ['barcode' => 'AKS-0004', 'qty' => 3],
                ],
            ],
            // ── Transaksi 17: Beli rak dapur + cermin ────────────────────────
            [
                'customer' => 'Bunga Maharani',
                'discount' => 0,
                'cash'     => 3000000,
                'items'    => [
                    ['barcode' => 'LMR-0006', 'qty' => 2],
                    ['barcode' => 'AKS-0001', 'qty' => 1],
                ],
            ],
            // ── Transaksi 18: Beli meja kerja + kursi ergonomis ──────────────
            [
                'customer' => 'Cici Amelia',
                'discount' => 100000,
                'cash'     => 4000000,
                'items'    => [
                    ['barcode' => 'MTB-0003', 'qty' => 1],
                    ['barcode' => 'MTB-0002', 'qty' => 1],
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

                    // Pastikan stok cukup
                    if ($product->stock < $item['qty']) {
                        $item['qty'] = max(1, $product->stock);
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

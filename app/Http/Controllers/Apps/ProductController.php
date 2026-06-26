<?php

namespace App\Http\Controllers\Apps;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $selectedCategoryId = $request->integer('category');
        $categories = $this->getAvailableCategories();
        $allowedCategoryIds = $categories->pluck('id')->all();

        $products = Product::query()
            ->when($request->search, function ($products) use ($request) {
                $products->where('title', 'like', '%' . $request->search . '%');
            })
            ->when(
                $selectedCategoryId && in_array($selectedCategoryId, $allowedCategoryIds, true),
                function ($products) use ($selectedCategoryId) {
                    $products->where('category_id', $selectedCategoryId);
                }
            )
            ->with(['category', 'images'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        //return inertia
        return Inertia::render('Dashboard/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->string('search')->toString(),
                'category' => $selectedCategoryId ?: null,
            ],
            'catalogBackgroundUrl' => $this->getCatalogBackgroundUrl(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $categories = $this->getAvailableCategories();

        //return inertia
        return Inertia::render('Dashboard/Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $maxGalleryImages = 9;

        /**
         * validate
         */
        $request->validate([
            'image' => 'required|image|max:2048',
            'gallery_images' => 'nullable|array|max:' . $maxGalleryImages,
            'gallery_images.*' => 'image|max:2048',
            'barcode' => 'nullable|unique:products,barcode',
            'title' => 'required',
            'description' => 'required',
            'category_id' => ['required', Rule::exists('categories', 'id')],
            'raw_material_price' => 'nullable|numeric|min:0',
            'upholstery_price' => 'nullable|numeric|min:0',
            'cushion_price' => 'nullable|numeric|min:0',
            'seat_pillow_price' => 'nullable|numeric|min:0',
            'glass_price' => 'nullable|numeric|min:0',
            'finishing_price' => 'nullable|numeric|min:0',
            'packing_price' => 'nullable|numeric|min:0',
            'buy_price' => 'nullable|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        //upload image
        $image = $request->file('image');
        $image->storeAs('public/products', $image->hashName());

        //create product
        $product = Product::create([
            'image' => $image->hashName(),
            'barcode' => $request->filled('barcode')
                ? $request->barcode
                : $this->generateUniqueBarcode(),
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            ...$this->buildProductCostPayload($request),
            'stock' => $request->integer('stock'),
        ]);

        $this->storeGalleryImages($product, $request->file('gallery_images', []));

        //redirect
        return to_route('products.index');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, Product $product)
    {
        $categories = $this->getAvailableCategories();

        return Inertia::render('Dashboard/Products/Edit', [
            'product' => $product->load('images'),
            'categories' => $categories,
            'returnPage' => max(1, $request->integer('page', 1)),
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Product $product)
    {
        $product->load(['category:id,name', 'images']);

        return Inertia::render('Dashboard/Products/Show', [
            'product' => $product,
            'galleryOnly' => $request->boolean('gallery'),
            'backCategory' => $request->filled('category_id')
                ? [
                    'id' => $request->integer('category_id'),
                    'name' => $request->string('category_name')->toString(),
                ]
                : null,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        $deletedGalleryImageIds = $request->input('deleted_gallery_image_ids', []);
        $remainingGalleryImagesCount = max(
            0,
            $product->images()->count() - count($deletedGalleryImageIds)
        );
        $maxGalleryImages = max(0, 9 - $remainingGalleryImagesCount);

        /**
         * validate
         */
        $request->validate([
            'image' => 'nullable|image|max:2048',
            'gallery_images' => 'nullable|array|max:' . $maxGalleryImages,
            'gallery_images.*' => 'image|max:2048',
            'deleted_gallery_image_ids' => 'nullable|array',
            'deleted_gallery_image_ids.*' => 'integer',
            'barcode' => 'nullable|unique:products,barcode,' . $product->id,
            'title' => 'required',
            'description' => 'required',
            'category_id' => ['required', Rule::exists('categories', 'id')],
            'raw_material_price' => 'nullable|numeric|min:0',
            'upholstery_price' => 'nullable|numeric|min:0',
            'cushion_price' => 'nullable|numeric|min:0',
            'seat_pillow_price' => 'nullable|numeric|min:0',
            'glass_price' => 'nullable|numeric|min:0',
            'finishing_price' => 'nullable|numeric|min:0',
            'packing_price' => 'nullable|numeric|min:0',
            'buy_price' => 'nullable|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        if ($request->hasFile('gallery_images') && count($request->file('gallery_images')) > $maxGalleryImages) {
            return back()
                ->withErrors([
                    'gallery_images' => 'Maksimal total 10 gambar per produk (1 utama + 9 galeri).',
                ])
                ->withInput();
        }

        $productPayload = [
            'barcode' => $request->filled('barcode')
                ? $request->barcode
                : ($product->barcode ?: $this->generateUniqueBarcode()),
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            ...$this->buildProductCostPayload($request),
            'stock' => $request->integer('stock'),
        ];

        if ($request->filled('deleted_gallery_image_ids')) {
            $this->deleteGalleryImages(
                $product,
                $request->input('deleted_gallery_image_ids', [])
            );
        }

        //check image update
        if ($request->file('image')) {
            //remove old image
            Storage::disk('local')->delete('public/products/' . basename($product->image));

            //upload new image
            $image = $request->file('image');
            $image->storeAs('public/products', $image->hashName());

            //update product with new image
            $product->update([
                'image' => $image->hashName(),
                ...$productPayload,
            ]);
        }

        //update product without image
        $product->update($productPayload);

        $this->storeGalleryImages($product, $request->file('gallery_images', []));

        //redirect
        return to_route('products.index', [
            'page' => max(1, $request->integer('page', 1)),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //find by ID
        $product = Product::findOrFail($id);

        //remove image
        Storage::disk('local')->delete('public/products/' . basename($product->image));

        foreach ($product->images as $galleryImage) {
            Storage::disk('local')->delete('public/products/' . basename($galleryImage->image));
        }

        //delete
        $product->delete();

        //redirect
        return back();
    }

    public function updateCatalogBackground(Request $request)
    {
        $request->validate([
            'catalog_background' => 'required|image|max:10240',
        ]);

        $background = $request->file('catalog_background');
        $directory = public_path('images/catalog-backgrounds');
        File::ensureDirectoryExists($directory);

        $currentBackground = $this->readCatalogBackgroundPath();

        if ($currentBackground && str_starts_with($currentBackground, '/images/catalog-backgrounds/')) {
            $oldPath = public_path(ltrim($currentBackground, '/'));

            if (File::exists($oldPath)) {
                File::delete($oldPath);
            }
        }

        $filename = 'catalog-background-' . now()->format('YmdHis') . '.' . $background->getClientOriginalExtension();
        $background->move($directory, $filename);

        $this->writeCatalogBackgroundPath('/images/catalog-backgrounds/' . $filename);

        return back();
    }

    private function getAvailableCategories()
    {
        return Category::query()
            ->orderBy('name')
            ->get();
    }

    private function buildProductCostPayload(Request $request): array
    {
        $rawMaterialPrice = $this->normalizePrice($request->input('raw_material_price'));
        $upholsteryPrice = $this->normalizePrice($request->input('upholstery_price'));
        $cushionPrice = $this->normalizePrice($request->input('cushion_price'));
        $seatPillowPrice = $this->normalizePrice($request->input('seat_pillow_price'));
        $glassPrice = $this->normalizePrice($request->input('glass_price'));
        $finishingPrice = $this->normalizePrice($request->input('finishing_price'));
        $packingPrice = $this->normalizePrice($request->input('packing_price'));

        $hasDetailedCosts = $request->filled('raw_material_price')
            || $request->filled('upholstery_price')
            || $request->filled('cushion_price')
            || $request->filled('seat_pillow_price')
            || $request->filled('glass_price')
            || $request->filled('finishing_price')
            || $request->filled('packing_price');

        $buyPrice = $hasDetailedCosts
            ? ($rawMaterialPrice + $upholsteryPrice + $cushionPrice + $seatPillowPrice + $glassPrice + $finishingPrice + $packingPrice)
            : $this->normalizePrice($request->input('buy_price'));

        return [
            'raw_material_price' => $rawMaterialPrice,
            'upholstery_price' => $upholsteryPrice,
            'cushion_price' => $cushionPrice,
            'seat_pillow_price' => $seatPillowPrice,
            'glass_price' => $glassPrice,
            'finishing_price' => $finishingPrice,
            'packing_price' => $packingPrice,
            'buy_price' => $buyPrice,
            'sell_price' => $this->normalizePrice($request->input('sell_price')),
        ];
    }

    private function normalizePrice($value): int
    {
        return (int) max(0, (int) $value);
    }

    private function generateUniqueBarcode(): string
    {
        do {
            $barcode = 'PRD-' . strtoupper(Str::random(8));
        } while (Product::where('barcode', $barcode)->exists());

        return $barcode;
    }

    private function storeGalleryImages(Product $product, array $galleryImages = []): void
    {
        if (empty($galleryImages)) {
            return;
        }

        $nextSortOrder = (int) $product->images()->max('sort_order');

        foreach ($galleryImages as $galleryImage) {
            if (! $galleryImage) {
                continue;
            }

            $galleryImage->storeAs('public/products', $galleryImage->hashName());

            $product->images()->create([
                'image' => $galleryImage->hashName(),
                'sort_order' => ++$nextSortOrder,
            ]);
        }
    }

    private function deleteGalleryImages(Product $product, array $galleryImageIds = []): void
    {
        $images = $product->images()
            ->whereIn('id', $galleryImageIds)
            ->get();

        foreach ($images as $image) {
            Storage::disk('local')->delete('public/products/' . basename($image->image));
            $image->delete();
        }
    }

    private function getCatalogBackgroundUrl(): string
    {
        return $this->readCatalogBackgroundPath() ?: '/images/catalog-hero.jpeg';
    }

    private function readCatalogBackgroundPath(): ?string
    {
        $configPath = storage_path('app/catalog-background.txt');

        if (! File::exists($configPath)) {
            return null;
        }

        $value = trim((string) File::get($configPath));

        return $value !== '' ? $value : null;
    }

    private function writeCatalogBackgroundPath(string $path): void
    {
        File::put(storage_path('app/catalog-background.txt'), $path);
    }
}

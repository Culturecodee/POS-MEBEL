<?php

namespace App\Http\Controllers\Apps;

use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    private function canViewCategories(): bool
    {
        $user = auth()->user();

        if (! $user) {
            return false;
        }

        return $user->isCustomer() || $user->hasPermissionTo('categories-access');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        abort_unless($this->canViewCategories(), 403);

        //get categories
        $categories = Category::when(request()->search, function ($categories) {
            $categories = $categories->where('name', 'like', '%' . request()->search . '%');
        })->latest()->paginate(10);

        //return inertia
        return Inertia::render('Dashboard/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Dashboard/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        /**
         * validate
         */
        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png|max:2048',
            'name' => 'required',
            'description' => 'required'
        ]);

        //upload image
        $image = $request->file('image');
        $image->storeAs('public/category', $image->hashName());

        //create category
        Category::create([
            'image' => $image->hashName(),
            'name' => $request->name,
            'description' => $request->description
        ]);

        //redirect
        return to_route('categories.index');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Category $category)
    {
        return Inertia::render('Dashboard/Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        abort_unless($this->canViewCategories(), 403);

        return Inertia::render('Dashboard/Categories/Show', [
            'category' => $category->load([
                'products' => fn ($query) => $query->with('images')->latest(),
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Category $category)
    {
        /**
         * validate
         */
        $request->validate([
            'name' => 'required',
            'description' => 'required'
        ]);

        //check image update
        if ($request->file('image')) {

            //remove old image
            Storage::disk('local')->delete('public/category/' . basename($category->image));

            //upload new image
            $image = $request->file('image');
            $image->storeAs('public/category', $image->hashName());

            //update category with new image
            $category->update([
                'image' => $image->hashName(),
                'name' => $request->name,
                'description' => $request->description
            ]);
        }

        //update category without image
        $category->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        //redirect
        return to_route('categories.index');
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
        $category = Category::findOrFail($id);

        // Cek apakah kategori sedang digunakan oleh produk
        if ($category->products()->count() > 0) {
            return back()->withErrors([
                'delete' => 'Kategori "' . $category->name . '" tidak dapat dihapus karena masih digunakan oleh ' . $category->products()->count() . ' produk.',
            ]);
        }

        //remove image
        Storage::disk('local')->delete('public/category/' . basename($category->image));

        //delete
        $category->delete();

        //redirect
        return to_route('categories.index');
    }
}

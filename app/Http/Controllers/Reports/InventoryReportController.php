<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryReportController extends Controller
{
    /**
     * Display the inventory report.
     */
    public function index(Request $request)
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);

        $filters = [
            'search' => trim((string) $request->input('search')),
        ];

        $productsQuery = Product::query()
            ->with('category:id,name')
            ->when($filters['search'], function ($query, $search) {
                $query->where(function ($builder) use ($search) {
                    $builder->where('title', 'like', '%' . $search . '%')
                        ->orWhere('barcode', 'like', '%' . $search . '%');
                });
            });

        $products = (clone $productsQuery)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $summaryQuery = clone $productsQuery;

        $summary = [
            'total_products' => (int) (clone $summaryQuery)->count(),
            'total_stock' => (int) (clone $summaryQuery)->sum('stock'),
            'low_stock_products' => (int) (clone $summaryQuery)->where('stock', '>', 0)->where('stock', '<=', 5)->count(),
            'out_of_stock_products' => (int) (clone $summaryQuery)->where('stock', '<=', 0)->count(),
        ];

        return Inertia::render('Dashboard/Reports/Inventory', [
            'products' => $products,
            'filters' => $filters,
            'summary' => $summary,
        ]);
    }
}

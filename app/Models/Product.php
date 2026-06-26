<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
    
    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'image',
        'barcode',
        'title',
        'description',
        'raw_material_price',
        'upholstery_price',
        'cushion_price',
        'seat_pillow_price',
        'glass_price',
        'finishing_price',
        'packing_price',
        'buy_price',
        'sell_price',
        'category_id',
        'stock',
    ];

    /**
     * category
     *
     * @return void
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * image
     *
     * @return Attribute
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (! $value) {
                    return null;
                }

                if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
                    $path = parse_url($value, PHP_URL_PATH);

                    return $path ?: $value;
                }

                if (str_starts_with($value, '/storage/')) {
                    return $value;
                }

                return '/storage/products/' . ltrim($value, '/');
            },
        );
    }
}

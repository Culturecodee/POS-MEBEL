<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image',
        'sort_order',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

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

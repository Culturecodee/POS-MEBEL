<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->bigInteger('raw_material_price')->default(0)->after('description');
            $table->bigInteger('upholstery_price')->default(0)->after('raw_material_price');
            $table->bigInteger('finishing_price')->default(0)->after('upholstery_price');
            $table->bigInteger('packing_price')->default(0)->after('finishing_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'raw_material_price',
                'upholstery_price',
                'finishing_price',
                'packing_price',
            ]);
        });
    }
};

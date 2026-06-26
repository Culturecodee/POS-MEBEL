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
            $table->bigInteger('seat_pillow_price')
                ->default(0)
                ->after('cushion_price');

            $table->bigInteger('glass_price')
                ->default(0)
                ->after('seat_pillow_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['seat_pillow_price', 'glass_price']);
        });
    }
};

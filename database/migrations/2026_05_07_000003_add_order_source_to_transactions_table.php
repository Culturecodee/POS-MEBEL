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
        Schema::table('transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('ordered_by_user_id')
                ->nullable()
                ->after('customer_id');

            $table->string('order_source')
                ->default('cashier')
                ->after('ordered_by_user_id');

            $table->foreign('ordered_by_user_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['ordered_by_user_id']);
            $table->dropColumn(['ordered_by_user_id', 'order_source']);
        });
    }
};

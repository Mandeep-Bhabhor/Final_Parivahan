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
        Schema::create('parcels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->text('pickup_address');
            $table->text('delivery_address');
            $table->decimal('pickup_latitude', 10, 8);
            $table->decimal('pickup_longitude', 11, 8);
            $table->decimal('delivery_latitude', 10, 8);
            $table->decimal('delivery_longitude', 11, 8);
            $table->decimal('weight', 10, 2);
            $table->decimal('height', 10, 2);
            $table->decimal('width', 10, 2);
            $table->decimal('length', 10, 2);
            $table->decimal('volume', 10, 2);
            $table->decimal('quoted_price', 10, 2)->nullable();
            $table->foreignId('assigned_warehouse_id')->nullable()->constrained('warehouses')->onDelete('set null');
            $table->foreignId('assigned_shipment_id')->nullable()->constrained('shipments')->onDelete('set null');
            $table->enum('status', ['pending', 'accepted', 'rejected', 'stored', 'loaded', 'dispatched', 'delivered'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parcels');
    }
};

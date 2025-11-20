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
        Schema::create('lapangan', function (Blueprint $table) {
            $table->id();

            $table->string('nama', 100);
            $table->string('gambar')->nullable(); // Boleh kosong jika gambar opsional
            $table->unsignedSmallInteger('kapasitas'); // Kapasitas (misal: 10-100 orang)
            $table->unsignedInteger('biaya_per_jam'); // Biaya (misal: dalam Rupiah)

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lapangan');
    }
};
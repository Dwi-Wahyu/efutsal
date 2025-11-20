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
        Schema::create('reservasi', function (Blueprint $table) {
            $table->id();

            // --- Relasi One-to-Many (Wajib) ---
            // Reservasi milik satu Lapangan
            $table->foreignId('lapangan_id')
                  ->constrained('lapangan') // Pastikan menunjuk ke tabel 'lapangan'
                  ->onDelete('cascade'); 

            // Reservasi dibuat oleh satu User
            $table->foreignId('user_id')
                  ->constrained('users') 
                  ->onDelete('cascade'); 
            
            // --- Detail Waktu & Durasi ---
            $table->date('date'); // Tanggal reservasi
            $table->time('start_time'); // Waktu mulai (misal: 18:00:00)
            $table->time('end_time'); // Waktu berakhir (misal: 19:00:00)
            $table->unsignedInteger('duration_hours'); // Durasi dalam jam (misal: 1 atau 2)

            // --- Detail Keuangan & Status ---
            $table->unsignedBigInteger('total_price'); // Total biaya (gunakan BigInteger untuk harga)
            $table->enum('status', ['pending', 'confirmed', 'paid', 'cancelled'])
                  ->default('pending'); 

            $table->timestamps();
            
            // --- Index untuk Optimasi Query (Opsional tapi direkomendasikan) ---
            // Index untuk mencari reservasi pada tanggal dan waktu tertentu (PENTING untuk cek ketersediaan)
            $table->index(['date', 'start_time', 'end_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservasi');
    }
};
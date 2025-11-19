<?php


namespace Database\Seeders;

use App\Models\Lapangan; 
use Illuminate\Database\Seeder;

class LapanganSeeder extends Seeder
{
    /**
     * Jalankan database seeds.
     */
    public function run(): void
    {
        // Buat 15 data lapangan dummy
        Lapangan::factory()->count(3)->create();
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lapangan extends Model
{
    /**
     * Trait untuk menggunakan LapanganFactory.
     * @use HasFactory<\Database\Factories\LapanganFactory>
     */
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model ini.
     * Laravel akan mengasumsikan 'lapangans', jadi kita definisikan secara eksplisit.
     *
     * @var string
     */
    protected $table = 'lapangan';

    /**
     * Atribut yang dapat diisi secara massal (mass assignable).
     * Ini penting saat menggunakan metode create() atau update().
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',
        'gambar',
        'kapasitas',
        'biaya_per_jam',
    ];

    /**
     * Atribut yang harus di-cast ke tipe asli.
     * Ini membantu memastikan data kapasitas dan biaya adalah angka, bukan string.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'kapasitas' => 'integer',
        'biaya_per_jam' => 'integer',
    ];
}
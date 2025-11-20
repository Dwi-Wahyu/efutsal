<?php

namespace App\Models;

use App\Enums\ReservasiStatus; // Import Enum Status Reservasi
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservasi extends Model
{
    use HasFactory;
    
    // Secara eksplisit mendefinisikan nama tabel. 
    protected $table = 'reservasi'; 

    // Kolom-kolom yang dapat diisi secara massal (mass assignable)
    protected $fillable = [
        'lapangan_id',
        'user_id',
        'date',
        'start_time',
        'end_time',
        'duration_hours',
        'total_price',
        'status', 
    ];

    // Casting untuk mengubah tipe data kolom menjadi tipe PHP yang sesuai secara otomatis
    protected $casts = [
        // Konversi kolom date ke objek Carbon Date
        'date' => 'date', 
        // Konversi kolom time ke objek Carbon DateTime (akan menambahkan tanggal default)
        'start_time' => 'datetime', 
        'end_time' => 'datetime',
        
        'duration_hours' => 'integer',
        'total_price' => 'integer',
        
        // Konversi nilai string di DB ke Enum Object
        'status' => ReservasiStatus::class, 
    ];
    
    // --- RELASI ELOQUENT ---
    // Kedua relasi di bawah adalah BelongsTo (One-to-Many: Child to Parent)

    /**
     * Mendapatkan Lapangan yang terkait dengan Reservasi ini.
     * Relasi: Reservasi Belongs To Lapangan (banyak ke satu)
     */
    public function lapangan(): BelongsTo
    {
        // Mencari foreign key 'lapangan_id' secara default
        return $this->belongsTo(Lapangan::class);
    }
    
    /**
     * Mendapatkan User yang membuat Reservasi ini.
     * Relasi: Reservasi Belongs To User (banyak ke satu)
     */
    public function user(): BelongsTo
    {
        // Mencari foreign key 'user_id' secara default
        return $this->belongsTo(User::class);
    }
}
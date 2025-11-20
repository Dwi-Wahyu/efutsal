<?php

namespace App\Enums;

use App\Traits\EnumToArray; // Trait untuk kemudahan penggunaan di form

// Menggunakan String Enum agar nilainya sesuai dengan kolom ENUM di database
enum ReservasiStatus: string
{
    // use EnumToArray; // Tambahkan jika Anda menggunakan Trait kustom

    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
    
    /**
     * Metode bantuan untuk mendapatkan label status yang ramah pengguna.
     * Digunakan di frontend atau view.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Menunggu Pembayaran',
            self::Confirmed => 'Dikonfirmasi',
            self::Paid => 'Lunas',
            self::Cancelled => 'Dibatalkan',
        };
    }
}
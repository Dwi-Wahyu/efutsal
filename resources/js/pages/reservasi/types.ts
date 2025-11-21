// Jika Anda tahu pasti value enum statusnya, lebih baik didefinisikan spesifik
export type ReservasiStatus =
    | 'pending'
    | 'confirmed'
    | 'cancelled'
    | 'completed';

export interface ReservasiItem {
    id: number;
    user_name: string;
    lapangan_nama: string;

    // Menjadi string karena sudah diformat ->format(...) di PHP
    tanggal_main: string;
    jam_mulai: string;
    jam_selesai: string;

    // Menjadi string karena ada prefix 'Rp ' dan number_format
    total_harga: string;

    // Laravel Enum biasanya dikirim sebagai string valuenya (value backing)
    status: ReservasiStatus | string;

    // Menjadi string karena konkatenasi "... Jam"
    durasi: string;
}

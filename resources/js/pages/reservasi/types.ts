export interface User {
    id: number;
    name: string;
}

export interface Lapangan {
    id: number;
    nama: string;
}

export interface Reservasi {
    id: number;
    tanggal: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    total_price: number;
    status: 'pending' | 'diterima' | 'ditolak' | string;
    user: User;
    lapangan: Lapangan;
    created_at: string;
    updated_at: string;
}

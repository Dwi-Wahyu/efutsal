import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { pengajuanReservasi } from '@/routes';
import { create } from '@/routes/lapangan';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock,
    MapPin,
    Ticket,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan Reservasi',
        href: pengajuanReservasi().url,
    },
];

interface RiwayatItem {
    id: number;
    lapangan_nama: string;
    lapangan_gambar: string | null;
    tanggal: string;
    jam: string;
    total_harga: string;
    status: string; // pending, confirmed, cancelled, completed, expired
    note: string | null; // <--- PASTIKAN INI ADA
}

export default function RiwayatReservasi({
    riwayatReservasi,
}: {
    riwayatReservasi: RiwayatItem[];
}) {
    // Helper Tampilan Status
    const renderStatus = (status: string, note: string | null) => {
        switch (status) {
            case 'confirmed':
                return (
                    <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">
                            Booking Diterima
                        </span>
                    </div>
                );
            case 'pending':
                return (
                    <div className="flex items-center gap-2 rounded-full border border-yellow-100 bg-yellow-50 px-3 py-1 text-yellow-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">
                            Menunggu Konfirmasi
                        </span>
                    </div>
                );
            case 'cancelled':
                return (
                    // PERBAIKAN: Tampilkan Alasan di bawah status Ditolak
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-red-600">
                            <XCircle className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">
                                Ditolak
                            </span>
                        </div>
                        {note && (
                            <span className="max-w-[150px] text-right text-[10px] text-red-500 italic">
                                Alasan: {note}
                            </span>
                        )}
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-blue-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">
                            Selesai
                        </span>
                    </div>
                );
            case 'expired':
                return (
                    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-gray-500">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">
                            Kadaluarsa
                        </span>
                    </div>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Reservasi" />

            <div className="mx-auto max-w-4xl p-6">
                <div className="mb-10 text-center">
                    <h1 className="mb-2 text-3xl font-bold">Riwayat Tiket</h1>
                    <p className="text-muted-foreground">
                        Pantau status booking dan jadwal main futsalmu di sini.
                    </p>
                </div>

                <div className="space-y-4">
                    {riwayatReservasi.length > 0 ? (
                        riwayatReservasi.map((item) => (
                            <div
                                key={item.id}
                                className={`relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md md:flex-row ${item.status === 'cancelled' ? 'opacity-75 grayscale-[0.5]' : ''} ${item.status === 'completed' || item.status === 'expired' ? 'opacity-60' : ''} `}
                            >
                                {/* GAMBAR LAPANGAN (KIRI) */}
                                <div className="relative h-32 w-full bg-neutral-200 md:h-auto md:w-48">
                                    {item.lapangan_gambar ? (
                                        <img
                                            src={`/storage/${item.lapangan_gambar}`}
                                            className="h-full w-full object-cover"
                                            alt="Lapangan"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-neutral-400">
                                            <MapPin />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden" />
                                </div>

                                {/* DETAIL TIKET (TENGAH) */}
                                <div className="flex flex-1 flex-col justify-center p-5">
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="text-lg font-bold text-foreground">
                                            {item.lapangan_nama}
                                        </h3>
                                        <div className="md:hidden">
                                            {renderStatus(
                                                item.status,
                                                item.note,
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-primary" />
                                            {item.tanggal}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            {item.jam} WIB
                                        </div>
                                    </div>
                                </div>

                                {/* HARGA & STATUS (KANAN) */}
                                <div className="flex min-w-[180px] flex-row items-center justify-between gap-4 border-t border-dashed border-neutral-200 bg-neutral-50/50 p-5 md:flex-col md:justify-center md:border-t-0 md:border-l dark:border-neutral-700 dark:bg-neutral-900/20">
                                    <div className="w-full text-left md:text-right">
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Total Bayar
                                        </p>
                                        <p className="text-xl font-bold text-foreground">
                                            {item.total_harga}
                                        </p>
                                    </div>
                                    <div className="flex hidden w-full justify-end md:block">
                                        {renderStatus(item.status, item.note)}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // EMPTY STATE
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 py-16 text-center dark:border-neutral-800">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <Ticket className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">
                                Belum ada riwayat
                            </h3>
                            <p className="mx-auto mb-6 max-w-xs text-muted-foreground">
                                Kamu belum pernah melakukan booking lapangan.
                                Yuk main sekarang!
                            </p>
                            <Button asChild>
                                <Link href={create().url}>Cari Lapangan</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

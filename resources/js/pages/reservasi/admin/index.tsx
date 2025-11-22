import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/lapangan';
import { pengajuanReservasi } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Plus, Ticket } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan Reservasi',
        href: pengajuanReservasi().url,
    },
];

export default function PengajuanReservasi() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Reservasi" />

            <div className="p-6 max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Riwayat Permainan</h1>
                    <p className="text-muted-foreground">Pantau status booking dan jadwal main futsalmu di sini.</p>
                </div>

                {/* EMPTY STATE (Visual Keren kalau belum ada data) */}
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <Ticket className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Belum Ada Jadwal Main</h2>
                    <p className="text-muted-foreground max-w-md text-center mb-8">
                        Jangan biarkan sepatumu berdebu! Ayo cari lapangan dan mulai pertandingan pertamamu sekarang.
                    </p>
                    <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
                        <Link href={create().url}> {/* Atau arahkan ke Home */}
                            <Plus className="mr-2 h-4 w-4" /> Buat Reservasi Baru
                        </Link>
                    </Button>
                </div>

                {/* NANTI: Jika sudah ada data dari backend, loop di sini menggunakan Card
                   dengan style tiket (border-l-4 border-primary).
                */}
            </div>
        </AppLayout>
    );
}
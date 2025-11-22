import LapanganCard from '@/components/lapangan-card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { home } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, Star, Trophy } from 'lucide-react';
import { Lapangan } from './lapangan';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: home().url,
    },
];

export default function Home({
    daftarLapangan,
}: {
    daftarLapangan: Lapangan[];
}) {
    const { user } = usePage().props.auth;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />

            {/* HERO SECTION */}
            <div className="relative overflow-hidden rounded-3xl bg-neutral-900 mx-4 mt-4 text-white shadow-2xl">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="https://images.unsplash.com/photo-1518605348433-e4319cfb4564?q=80&w=2000&auto=format&fit=crop" 
                        alt="Background Futsal" 
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                
                <div className="relative z-10 p-10 md:p-16 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/20 mb-4">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        Booking Mudah & Cepat
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                        Main Futsal Tanpa Ribet
                    </h1>
                    <p className="text-neutral-300 text-lg mb-8 leading-relaxed">
                        Cari lapangan terbaik, cek jadwal kosong, dan booking langsung dari HP-mu. 
                        Siapkan tim, kami siapkan lapangannya.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white border-0" asChild>
                            <a href="#daftar-lapangan">Booking Sekarang</a>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/20 hover:text-white">
                            Pelajari Cara Main
                        </Button>
                    </div>
                </div>
            </div>

            {/* FEATURES / STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-8">
                <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Lapangan Premium</h3>
                        <p className="text-sm text-muted-foreground">Rumput sintetis standar FIFA</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
                        <Star className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Layanan Terbaik</h3>
                        <p className="text-sm text-muted-foreground">Fasilitas lengkap & bersih</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Transaksi Aman</h3>
                        <p className="text-sm text-muted-foreground">Pembayaran terverifikasi</p>
                    </div>
                </div>
            </div>

            {/* LIST LAPANGAN SECTION */}
            <div id="daftar-lapangan" className="p-6 md:p-10 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Pilih Arena Bermain</h2>
                        <p className="text-muted-foreground mt-1">Temukan lapangan yang sesuai dengan strategimu</p>
                    </div>
                </div>

                {daftarLapangan.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {daftarLapangan.map((lapangan) => (
                            <LapanganCard lapangan={lapangan} key={lapangan.id} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
                        <p className="text-lg font-medium text-muted-foreground">Belum ada data lapangan tersedia.</p>
                        {user?.is_admin && (
                            <Button variant="link" className="mt-2">Input Data Sekarang</Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
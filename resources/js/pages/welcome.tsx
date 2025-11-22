import { Button } from '@/components/ui/button';
import { cariLapangan, dashboard, login, register } from '@/routes';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    Phone,
    ShieldCheck,
    Star,
    Trophy,
} from 'lucide-react';
import GuestLapanganCard from './guest-lapangan-card';

// Definisi tipe data Lapangan untuk halaman ini
interface Lapangan {
    id: number;
    nama: string;
    gambar: string;
    kapasitas: number;
    biaya_per_jam: number;
}

export default function Welcome({
    canRegister,
    daftarLapangan,
}: {
    canRegister: boolean;
    daftarLapangan: Lapangan[];
}) {
    const { auth } = usePage<SharedData>().props;

    // Helper format rupiah
    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return (
        <>
            <Head title="Selamat Datang di eFutsal" />

            <div className="min-h-screen bg-background font-sans text-foreground">
                {/* --- TOPBAR / NAVIGATION --- */}
                <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img
                                src="/app-logo.png"
                                alt="eFutsal Logo"
                                className="h-8 w-8 rounded-full"
                            />
                            <span className="text-xl font-bold tracking-tight text-primary">
                                eFutsal
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Button
                                    asChild
                                    variant="default"
                                    className="rounded-full px-6"
                                >
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        Masuk
                                    </Link>
                                    {canRegister && (
                                        <Button
                                            asChild
                                            variant="default"
                                            className="rounded-full px-6"
                                        >
                                            <Link href={register()}>
                                                Daftar Sekarang
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* --- HERO SECTION --- */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
                    {/* Background Image Overlay */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2836&auto=format&fit=crop"
                            alt="Futsal Background"
                            className="h-full w-full object-cover opacity-10 dark:opacity-5"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
                    </div>

                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            <Star className="mr-2 h-4 w-4 fill-primary" />{' '}
                            Platform Booking Futsal #1
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
                            Main Futsal{' '}
                            <span className="text-primary">Tanpa Ribet</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                            Cari lapangan terdekat, cek jadwal kosong secara
                            real-time, dan booking langsung dari gadgetmu. Atur
                            pertandinganmu sekarang!
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            <Button
                                size="lg"
                                className="h-12 rounded-full px-8 text-base"
                                asChild
                            >
                                <a href="#daftar-lapangan">Cari Lapangan</a>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 rounded-full px-8 text-base"
                            >
                                Pelajari Fitur
                            </Button>
                        </div>
                    </div>
                </section>

                {/* --- FEATURES SECTION --- */}
                <section className="border-y border-border/50 bg-muted/30 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Kenapa Pilih eFutsal?
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Semua kemudahan dalam satu aplikasi untuk
                                komunitas futsal.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="rounded-2xl border bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">
                                    Jadwal Real-time
                                </h3>
                                <p className="text-muted-foreground">
                                    Tidak perlu telepon sana-sini. Cek
                                    ketersediaan lapangan langsung dari
                                    aplikasi, akurat dan cepat.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="rounded-2xl border bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">
                                    Booking Aman
                                </h3>
                                <p className="text-muted-foreground">
                                    Sistem reservasi yang terjamin. Dapatkan
                                    bukti booking digital dan konfirmasi
                                    langsung ke WhatsApp.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="rounded-2xl border bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                    <Trophy className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">
                                    Lapangan Premium
                                </h3>
                                <p className="text-muted-foreground">
                                    Kami hanya bekerja sama dengan penyedia
                                    lapangan berkualitas standar untuk
                                    kenyamanan bermainmu.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- LIST LAPANGAN SECTION --- */}
                <section id="daftar-lapangan" className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Pilihan Arena Terbaik
                                </h2>
                                <p className="mt-2 text-muted-foreground">
                                    Temukan lapangan favoritmu dan mulai
                                    bermain.
                                </p>
                            </div>
                            <Button variant="ghost" asChild>
                                <Link href={cariLapangan()}>
                                    Lihat Semua Lapangan &rarr;
                                </Link>
                            </Button>
                        </div>

                        {daftarLapangan.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {daftarLapangan.map((lapangan) => (
                                    <GuestLapanganCard
                                        lapangan={lapangan}
                                        key={lapangan.id}
                                        loggedIn={auth.user !== null}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed p-12 text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <Calendar className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                    Belum ada lapangan
                                </h3>
                                <p className="text-muted-foreground">
                                    Data lapangan akan segera tersedia.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* --- CTA SECTION --- */}
                <section className="relative overflow-hidden bg-neutral-900 py-20 text-white">
                    <div className="absolute inset-0 opacity-20">
                        {/* Pattern Background */}
                        <svg
                            className="h-full w-full"
                            width="100%"
                            height="100%"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <pattern
                                    id="a"
                                    width="40"
                                    height="40"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <circle
                                        cx="2"
                                        cy="2"
                                        r="2"
                                        fill="currentColor"
                                    />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#a)" />
                        </svg>
                    </div>
                    <div className="relative mx-auto max-w-4xl px-6 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Siap untuk Pertandingan Berikutnya?
                        </h2>
                        <p className="mb-8 text-lg text-neutral-300">
                            Jangan sampai kehabisan jadwal. Daftar sekarang dan
                            nikmati kemudahan booking lapangan futsal di kotamu.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            {canRegister && !auth.user && (
                                <Button
                                    size="lg"
                                    variant="default"
                                    className="h-auto bg-white px-8 py-6 text-lg text-black hover:bg-neutral-200"
                                    asChild
                                >
                                    <Link href={register()}>
                                        Buat Akun Gratis
                                    </Link>
                                </Button>
                            )}
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-auto border-white bg-transparent px-8 py-6 text-lg text-white hover:bg-white/10"
                            >
                                <Phone className="mr-2 h-5 w-5" /> Hubungi Admin
                            </Button>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="border-t border-border bg-background py-12">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <img
                                src="/app-logo.png"
                                alt="Logo"
                                className="h-6 w-6 opacity-80 grayscale"
                            />
                            <span className="text-sm font-semibold text-muted-foreground">
                                eFutsal &copy; 2025
                            </span>
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-primary">
                                Tentang Kami
                            </a>
                            <a href="#" className="hover:text-primary">
                                Syarat & Ketentuan
                            </a>
                            <a href="#" className="hover:text-primary">
                                Kebijakan Privasi
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

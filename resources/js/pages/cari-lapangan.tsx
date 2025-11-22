import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard, login, register } from '@/routes'; // Pastikan route ini ada
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';
import GuestLapanganCard from './guest-lapangan-card';

// Tipe data Lapangan
interface Lapangan {
    id: number;
    nama: string;
    gambar: string;
    kapasitas: number;
    biaya_per_jam: number;
}

export default function GuestLapanganIndex({
    daftarLapangan,
}: {
    daftarLapangan: Lapangan[];
}) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState('');

    // Filter sederhana di sisi client
    const filteredLapangan = daftarLapangan.filter((lap) =>
        lap.nama.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <>
            <Head title="Cari Lapangan" />

            <div className="min-h-screen bg-background font-sans text-foreground">
                {/* --- NAVBAR --- */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="flex items-center gap-2">
                                <img
                                    src="/app-logo.png"
                                    alt="Logo"
                                    className="h-8 w-8 rounded-full"
                                />
                                <span className="hidden text-lg font-bold tracking-tight text-primary sm:block">
                                    eFutsal
                                </span>
                            </Link>
                        </div>

                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Button
                                    asChild
                                    variant="default"
                                    className="rounded-full"
                                >
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-medium transition-colors hover:text-primary"
                                    >
                                        Masuk
                                    </Link>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="rounded-full"
                                    >
                                        <Link href={register()}>Daftar</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="py-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* --- HEADER & SEARCH --- */}
                        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-1 text-sm hover:text-primary"
                                    >
                                        <ArrowLeft className="h-4 w-4" />{' '}
                                        Kembali ke Home
                                    </Link>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Temukan Arena
                                </h1>
                                <p className="text-muted-foreground">
                                    Pilih lapangan favoritmu dan booking
                                    sekarang.
                                </p>
                            </div>

                            <div className="relative w-full md:w-72">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama lapangan..."
                                    className="rounded-full bg-muted/50 pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* --- GRID LAPANGAN --- */}
                        {filteredLapangan.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredLapangan.map((lapangan) => (
                                    <GuestLapanganCard
                                        lapangan={lapangan}
                                        key={lapangan.id}
                                        loggedIn={auth.user !== null}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center">
                                <p className="text-lg font-medium text-muted-foreground">
                                    Lapangan tidak ditemukan.
                                </p>
                                <Button
                                    variant="link"
                                    onClick={() => setSearch('')}
                                >
                                    Reset Pencarian
                                </Button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

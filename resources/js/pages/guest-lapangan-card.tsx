import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/routes';
import { Link } from '@inertiajs/react';
import { Calendar, Users } from 'lucide-react';
import { Lapangan } from './lapangan';

export default function GuestLapanganCard({
    lapangan,
    loggedIn,
}: {
    lapangan: Lapangan;
    loggedIn: boolean;
}) {
    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return (
        <Card
            key={lapangan.id}
            className="group overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl"
        >
            <CardHeader>
                <div className="relative aspect-[16/10] overflow-hidden rounded bg-neutral-200 shadow">
                    {lapangan.gambar ? (
                        <img
                            src={`/storage/${lapangan.gambar}`}
                            alt={lapangan.nama}
                            className="h-full w-full rounded object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            Tidak ada gambar
                        </div>
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                        <Users className="h-3 w-3" /> {lapangan.kapasitas} Orang
                    </div>
                </div>

                <div>
                    <CardTitle className="text-xl">{lapangan.nama}</CardTitle>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-green-500">
                            {formatRupiah(lapangan.biaya_per_jam)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            / jam
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardFooter>
                <Button className="w-full rounded-full" size="lg" asChild>
                    <Link
                        href={
                            loggedIn
                                ? `/lapangan/${lapangan.id}/reservasi`
                                : login()
                        }
                    >
                        <Calendar />
                        {loggedIn ? 'Booking Sekarang' : 'Login untuk Booking'}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

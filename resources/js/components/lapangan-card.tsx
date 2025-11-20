import formatPrice from '@/lib/format-price';
import { Lapangan } from '@/pages/lapangan';
import { show } from '@/routes/lapangan';
import { Link } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export default function LapanganCard({ lapangan }: { lapangan: Lapangan }) {
    return (
        <Link
            href={show(lapangan)}
            key={lapangan.id}
            className="hover:shadow-lg"
        >
            <Card key={lapangan.id}>
                <CardContent>
                    <img
                        src={'/storage/' + lapangan.gambar}
                        alt={`Gambar lapangan ${lapangan.nama}`}
                        className="mb-4 rounded object-cover"
                    />

                    <div className="flex items-center justify-between gap-2">
                        <h1 className="font-semibold">{lapangan.nama}</h1>

                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {lapangan.kapasitas}
                        </div>
                    </div>

                    <p className="">
                        Rp
                        {formatPrice(lapangan.biaya_per_jam)} / Jam
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}

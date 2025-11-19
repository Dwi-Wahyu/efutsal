import NavigationButton from '@/components/navigation-button';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import formatPrice from '@/lib/format-price';
import { create, index } from '@/routes/lapangan';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Users } from 'lucide-react';

// Tipe data untuk Lapangan (gunakan tipe yang sesuai dengan data Anda)
export type Lapangan = {
    id: number;
    nama: string;
    kapasitas: number;
    gambar: string;
    biaya_per_jam: number;
};

// Definisikan props yang diterima oleh komponen ini
interface DaftarLapanganProps {
    daftarLapangan: Lapangan[]; // Array data lapangan
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Lapangan',
        href: index().url,
    },
];

export default function DaftarLapangan({
    daftarLapangan,
}: DaftarLapanganProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Lapangan" />

            <div className="p-4">
                <div className="flex items-center justify-between">
                    <PageTitle>Daftar Lapangan</PageTitle>

                    <NavigationButton type="button" href={create().url}>
                        Input Lapangan
                    </NavigationButton>
                </div>

                {/* --- Tempat Menampilkan Data --- */}
                <div className="mt-6">
                    {daftarLapangan.length > 0 ? (
                        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Lakukan mapping (looping) pada array daftarLapangan */}
                            {daftarLapangan.map((lapangan) => (
                                <Link
                                    href={'/data-lapangan/' + lapangan.id}
                                    key={lapangan.id}
                                    className="hover:shadow-lg"
                                >
                                    <Card key={lapangan.id}>
                                        <CardContent>
                                            <div className="flex items-center justify-between gap-2">
                                                <h1 className="font-semibold">
                                                    {lapangan.nama}
                                                </h1>
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Users className="h-4 w-4" />
                                                    {lapangan.kapasitas}
                                                </div>
                                            </div>
                                            <p className="">
                                                Rp
                                                {formatPrice(
                                                    lapangan.biaya_per_jam,
                                                )}{' '}
                                                / Jam
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">
                            Belum ada data lapangan. Silakan input data baru.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

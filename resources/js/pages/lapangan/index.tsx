import { index } from '@/actions/App/Http/Controllers/LapanganController';
import LapanganCard from '@/components/lapangan-card';
import NavigationButton from '@/components/navigation-button';
import { PageTitle } from '@/components/page-title';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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

                    <NavigationButton
                        type="button"
                        href={'/data-lapangan/input'}
                    >
                        Input Lapangan
                    </NavigationButton>
                </div>

                {/* --- Tempat Menampilkan Data --- */}
                <div className="mt-6">
                    {daftarLapangan.length > 0 ? (
                        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Lakukan mapping (looping) pada array daftarLapangan */}
                            {daftarLapangan.map((lapangan) => (
                                <LapanganCard
                                    lapangan={lapangan}
                                    key={lapangan.id}
                                />
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

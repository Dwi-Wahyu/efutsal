import AppLayout from '@/layouts/app-layout';
import { pengajuanReservasi } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan Reservasi',
        href: pengajuanReservasi().url,
    },
];

export default function PengajuanReservasi() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Reservasi" />

            <h1>Ini daftar reservasi</h1>
        </AppLayout>
    );
}

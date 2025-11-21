import AppLayout from '@/layouts/app-layout';
import { admin_reservasi_index } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ReservasiItem } from '../types';

export default function ShowReservasiAdmin({
    reservasi,
}: {
    reservasi: ReservasiItem;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pengajuan Reservasi',
            href: admin_reservasi_index().url,
        },
    ];

    return (
        <div>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Detail Pengajuan" />
            </AppLayout>
        </div>
    );
}

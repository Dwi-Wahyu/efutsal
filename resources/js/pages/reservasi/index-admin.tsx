import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import AppLayout from '@/layouts/app-layout';
import { pengajuanReservasi } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Reservasi } from './types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan Reservasi',
        href: pengajuanReservasi().url,
    },
];

export default function PengajuanReservasi({
    daftarReservasi,
}: {
    daftarReservasi: Reservasi[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Reservasi" />

            {daftarReservasi.map((reservasi) => {
                return (
                    <Link href={''} key={reservasi.id}>
                        <Item variant={'outline'}>
                            <ItemContent>
                                <ItemTitle>{reservasi.lapangan.nama}</ItemTitle>
                                <ItemDescription>
                                    {reservasi.tanggal}
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions />
                        </Item>
                    </Link>
                );
            })}
        </AppLayout>
    );
}

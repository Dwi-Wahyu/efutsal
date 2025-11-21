import { Badge } from '@/components/ui/badge';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import AppLayout from '@/layouts/app-layout';
import { pengajuanReservasi } from '@/routes';
import { show } from '@/routes/reservasi';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ReservasiItem } from '../types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan Reservasi',
        href: pengajuanReservasi().url,
    },
];

export default function IndexReservasiAdmin({
    daftarReservasi,
}: {
    daftarReservasi: ReservasiItem[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Reservasi" />

            <div className="p-4">
                {daftarReservasi.map((reservasi) => {
                    return (
                        <Link href={show(reservasi)} key={reservasi.id}>
                            <Item variant={'outline'}>
                                <ItemContent>
                                    <ItemTitle>
                                        {reservasi.lapangan_nama}
                                    </ItemTitle>

                                    <ItemDescription>
                                        <h1>{reservasi.user_name}</h1>
                                    </ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <Badge>{reservasi.status}</Badge>
                                </ItemActions>
                            </Item>
                        </Link>
                    );
                })}
            </div>
        </AppLayout>
    );
}

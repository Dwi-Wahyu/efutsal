import NavigationButton from '@/components/navigation-button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import formatPrice from '@/lib/format-price';
import { edit } from '@/routes/lapangan';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Lapangan } from '.';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Lapangan',
        href: '/data-lapangan',
    },
    {
        title: 'Detail Lapangan',
        href: '/data-lapangan',
    },
];

export default function DetailLapangan({ lapangan }: { lapangan: Lapangan }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Lapangan" />

            <Card className="m-4 mx-auto w-xl">
                <CardContent className="flex flex-col gap-4">
                    <h1 className="text-lg font-semibold">{lapangan.nama}</h1>

                    <div>
                        <h1 className="">Harga</h1>
                        <h1 className="text-muted-foreground">
                            Rp{formatPrice(lapangan.biaya_per_jam)} / Jam
                        </h1>
                    </div>

                    <div>
                        <h1 className="">Kapasitas</h1>
                        <h1 className="text-muted-foreground">
                            {lapangan.kapasitas} Orang
                        </h1>
                    </div>

                    <img
                        src={lapangan.gambar}
                        alt=""
                        onError={() => <div>error</div>}
                    />

                    <div className="flex justify-end gap-2">
                        <NavigationButton
                            href={'/data-lapangan'}
                            type="button"
                        />
                        <NavigationButton
                            variant={'default'}
                            href={edit(lapangan).url}
                            type="button"
                        >
                            Edit
                        </NavigationButton>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}

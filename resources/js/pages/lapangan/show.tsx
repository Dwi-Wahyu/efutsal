import NavigationButton from '@/components/navigation-button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import formatPrice from '@/lib/format-price';
import { edit, show } from '@/routes/lapangan';
import { createFromLapangan } from '@/routes/reservasi';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Lapangan } from '.';

export default function DetailLapangan({ lapangan }: { lapangan: Lapangan }) {
    const { user } = usePage().props.auth;

    const userBreadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: '/home',
        },
        {
            title: 'Detail Lapangan',
            href: show(lapangan).url,
        },
    ];

    const adminBreadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Daftar Lapangan',
            href: '/data-lapangan',
        },
        {
            title: 'Detail Lapangan',
            href: show(lapangan).url,
        },
    ];

    if (!user) {
        return (
            <div>
                <h1>Login dulu</h1>
            </div>
        );
    }

    return (
        <AppLayout
            breadcrumbs={user.is_admin ? adminBreadcrumbs : userBreadcrumbs}
        >
            <Head title="Detail Lapangan" />

            <Card className="m-4 mx-auto w-xl">
                <CardContent className="flex flex-col gap-4">
                    <h1 className="text-lg font-semibold">{lapangan.nama}</h1>

                    <img
                        src={'/storage/' + lapangan.gambar}
                        alt={`Gambar lapangan ${lapangan.nama}`}
                        className="rounded object-cover"
                    />

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

                    {user.is_admin ? (
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
                    ) : (
                        <div className="flex justify-end gap-2">
                            <NavigationButton href={'/home'} type="button" />
                            <NavigationButton
                                variant={'default'}
                                href={createFromLapangan(lapangan).url}
                                type="button"
                            >
                                Buat Reservasi
                            </NavigationButton>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}

import LapanganCard from '@/components/lapangan-card';
import AppLayout from '@/layouts/app-layout';
import { home } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Lapangan } from './lapangan';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: home().url,
    },
];

export default function Home({
    daftarLapangan,
}: {
    daftarLapangan: Lapangan[];
}) {
    const { user } = usePage().props.auth;

    if (!user) {
        return <div></div>;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />

            <div className="p-4">
                <h1 className="mb-1 text-lg font-semibold">
                    Selamat Datang {user.name}
                </h1>

                <h1 className="mb-4 text-muted-foreground">
                    Mau Main Dimana ?
                </h1>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {daftarLapangan.map((lapangan) => (
                        <LapanganCard lapangan={lapangan} key={lapangan.id} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

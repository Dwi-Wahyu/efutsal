import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { home } from '@/routes';
import { index } from '@/routes/reservasi';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function ReservasiLapangan() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: home().url,
        },
        {
            title: 'Pengajuan Reservasi',
            href: index().url,
        },
    ];

    const { user } = usePage().props.auth;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reservasi Lapangan" />

            <Card className="m-4mx-auto w-xl">
                <CardContent>
                    <h1 className="text-2xl font-semibold">
                        Formulir Reservasi
                    </h1>
                </CardContent>
            </Card>
        </AppLayout>
    );
}

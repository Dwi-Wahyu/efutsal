import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { pengajuanReservasi } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Clock, Search, User, XCircle } from 'lucide-react';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Reservasi',
        href: pengajuanReservasi().url,
    },
];

interface ReservasiAdminItem {
    id: number;
    user_name: string;
    lapangan_nama: string;
    tanggal_main: string;
    jam: string;
    total_harga: string;
    status: string;
    note: string | null;
}

export default function IndexReservasiAdmin({
    daftarReservasi,
}: {
    daftarReservasi: ReservasiAdminItem[];
}) {
    // State untuk Modal Reject
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [reasonType, setReasonType] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');
    const [processing, setProcessing] = useState(false);

    // Helper Warna Badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        Menunggu
                    </Badge>
                );
            case 'confirmed':
                return (
                    <Badge className="border-green-200 bg-green-100 text-green-800 hover:bg-green-200">
                        Diterima
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge className="border-red-200 bg-red-100 text-red-800 hover:bg-red-200">
                        Ditolak
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Handle Approve
    const handleApprove = (id: number) => {
        if (confirm('Terima reservasi ini?')) {
            router.post(
                `/admin/reservasi/${id}/approve`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    // Handle Buka Modal Reject
    const openRejectModal = (id: number) => {
        setSelectedId(id);
        setReasonType('');
        setCustomReason('');
        setIsRejectOpen(true);
    };

    // Handle Submit Reject
    const submitReject = () => {
        if (!selectedId) return;

        const finalReason =
            reasonType === 'Lainnya' ? customReason : reasonType;

        if (!finalReason) {
            alert('Pilih atau isi alasan penolakan');
            return;
        }

        setProcessing(true);
        router.post(
            `/admin/reservasi/${selectedId}/reject`,
            {
                reason: finalReason,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsRejectOpen(false);
                    setProcessing(false);
                },
                onError: () => setProcessing(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Reservasi" />

            <div className="p-6">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Daftar Pengajuan
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola persetujuan jadwal lapangan.
                        </p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder="Cari pesanan..."
                            className="h-9 w-full rounded-full border border-input bg-background px-3 py-1 pl-9 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                        />
                    </div>
                </div>

                <Card className="border-none bg-white/80 shadow-lg backdrop-blur dark:bg-neutral-900/80">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/30 text-xs text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">
                                            Jadwal Main
                                        </th>
                                        <th className="px-6 py-4">Lapangan</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4 text-center">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {daftarReservasi.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="group transition-colors hover:bg-muted/40"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                                        {item.user_name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {item.user_name}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <User className="h-3 w-3" />{' '}
                                                            Member
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {item.tanggal_main}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />{' '}
                                                        {item.jam}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {item.lapangan_nama}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-green-600">
                                                {item.total_harga}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(item.status)}
                                                {item.status === 'cancelled' &&
                                                    item.note && (
                                                        <div
                                                            className="mx-auto mt-1 max-w-[120px] truncate text-[10px] text-red-500"
                                                            title={item.note}
                                                        >
                                                            {item.note}
                                                        </div>
                                                    )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {item.status === 'pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() =>
                                                                openRejectModal(
                                                                    item.id,
                                                                )
                                                            }
                                                        >
                                                            Tolak
                                                        </Button>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-green-600 text-white hover:bg-green-700"
                                                                >
                                                                    Terima
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        {' '}
                                                                        Terima
                                                                        Reservasi?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Apakah
                                                                        Anda
                                                                        yakin
                                                                        ingin
                                                                        menerima
                                                                        reservasi
                                                                        ini?
                                                                        Status
                                                                        reservasi
                                                                        akan
                                                                        diperbarui
                                                                        menjadi
                                                                        'Diterima'
                                                                        dan
                                                                        jadwal
                                                                        akan
                                                                        dikunci
                                                                        untuk
                                                                        pelanggan
                                                                        ini.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Batal
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            onClick={() =>
                                                                                handleApprove(
                                                                                    item.id,
                                                                                )
                                                                            }
                                                                            className="bg-green-600 text-white hover:bg-green-700"
                                                                        >
                                                                            Yakin
                                                                        </Button>
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        Selesai
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {daftarReservasi.length === 0 && (
                            <div className="p-12 text-center text-muted-foreground">
                                Tidak ada data reservasi.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* MODAL REJECT */}
            <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-5 w-5" /> Tolak Reservasi
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Berikan alasan mengapa reservasi ini ditolak. Pesan
                            ini akan dilihat oleh user.
                        </AlertDialogDescription>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Alasan Penolakan</Label>
                                <Select onValueChange={setReasonType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih alasan..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Lapangan Penuh / Double Booked">
                                            Lapangan Penuh / Double Booked
                                        </SelectItem>
                                        <SelectItem value="Sedang Maintenance / Perbaikan">
                                            Sedang Maintenance / Perbaikan
                                        </SelectItem>
                                        <SelectItem value="Bukti Pembayaran Tidak Valid">
                                            Bukti Pembayaran Tidak Valid
                                        </SelectItem>
                                        <SelectItem value="Lainnya">
                                            Lainnya (Tulis Sendiri)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {reasonType === 'Lainnya' && (
                                <div className="space-y-2">
                                    <Label>Detail Alasan</Label>
                                    <Textarea
                                        placeholder="Tulis alasan spesifik..."
                                        value={customReason}
                                        onChange={(e) =>
                                            setCustomReason(e.target.value)
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setIsRejectOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={submitReject}
                            disabled={
                                !reasonType ||
                                (reasonType === 'Lainnya' && !customReason) ||
                                processing
                            }
                        >
                            {processing ? 'Memproses...' : 'Konfirmasi Tolak'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

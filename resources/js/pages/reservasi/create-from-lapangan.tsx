import NavigationButton from '@/components/navigation-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import formatPrice from '@/lib/format-price';
import { home } from '@/routes';
import { index as lapanganIndex, show } from '@/routes/lapangan';
import { createFromLapangan, storeFromLapangan } from '@/routes/reservasi';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Calendar,
    Info,
    MapPin,
    MessageCircle,
    Users,
    Wallet,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Lapangan } from '../lapangan';

interface Props {
    lapangan: Lapangan;
}

// Helper format rupiah (Pastikan import formatPrice dari '@/lib/format-price' berfungsi)
const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const breadcrumbs = (lapangan: Lapangan): BreadcrumbItem[] => [
    { title: 'Home', href: home().url },
    { title: 'Lapangan', href: lapanganIndex().url },
    { title: lapangan.nama, href: show(lapangan).url },
    { title: 'Booking', href: createFromLapangan(lapangan).url },
];

export default function ReservasiCreate({ lapangan }: Props) {
    const [durationHours, setDurationHours] = useState<number | null>(null);
    const [totalPrice, setTotalPrice] = useState<number | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        date: '' as string,
        start_time: '',
        end_time: '',
    });

    useEffect(() => {
        if (data.start_time && data.end_time) {
            const [startHour, startMinute] = data.start_time
                .split(':')
                .map(Number);
            const [endHour, endMinute] = data.end_time.split(':').map(Number);

            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;

            if (endMinutes > startMinutes) {
                const hours = (endMinutes - startMinutes) / 60;
                const price = hours * (lapangan.biaya_per_jam ?? 0);
                setDurationHours(hours);
                setTotalPrice(price);
            } else {
                setDurationHours(null);
                setTotalPrice(null);
            }
        } else {
            setDurationHours(null);
            setTotalPrice(null);
        }
    }, [data.start_time, data.end_time, lapangan.biaya_per_jam]);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!data.date) {
            toast.warning('Tanggal Belum Dipilih', {
                description: 'Silakan pilih tanggal main terlebih dahulu.',
            });
            return;
        }

        if (!durationHours || !totalPrice) {
            toast.warning('Jam Belum Lengkap', {
                description: 'Pastikan jam selesai lebih besar dari jam mulai.',
            });
            return;
        }

        post(storeFromLapangan(lapangan).url, {
            preserveScroll: true,
            onError: (errors) => {
                if (errors.start_time) {
                    toast.error('Gagal Membuat Reservasi', {
                        description: errors.start_time,
                        duration: 5000,
                    });
                }
            },
            onSuccess: () => {
                toast.success('Berhasil!', {
                    description:
                        'Reservasi diajukan. Mengalihkan ke WhatsApp...',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(lapangan)}>
            <Head title={`Booking ${lapangan.nama}`} />

            {/* --- HERO SECTION --- */}
            <div className="relative h-[350px] w-full bg-neutral-900">
                {lapangan.gambar ? (
                    <img
                        src={`/storage/${lapangan.gambar}`}
                        alt={lapangan.nama}
                        className="h-full w-full object-cover opacity-60"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-500">
                        <Info className="h-20 w-20 opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                    <div className="mx-auto max-w-6xl">
                        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                            <div>
                                <span className="mb-2 inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-md">
                                    Futsal Arena
                                </span>
                                <h1 className="text-3xl font-bold text-black md:text-5xl">
                                    {lapangan.nama}
                                </h1>
                                <div className="mt-2 flex items-center gap-4 text-neutral-300">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 fill-black" />
                                        <span className="text-sm text-stone-950">
                                            Lokasi Strategis
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-4 w-4 fill-black" />
                                        <span className="text-sm text-stone-950">
                                            Kapasitas {lapangan.kapasitas} Orang
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-right md:mt-0">
                                <p className="text-sm text-neutral-300">
                                    Mulai dari
                                </p>
                                <p className="text-3xl font-bold text-primary">
                                    {formatRupiah(lapangan.biaya_per_jam)}
                                    <span className="text-base font-normal text-black">
                                        {' '}
                                        / jam
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* KOLOM KIRI: INFO & RULES */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="border-none bg-transparent shadow-none">
                            <CardContent className="px-0 leading-relaxed text-muted-foreground">
                                <p className="text-black">
                                    Nikmati pengalaman bermain futsal terbaik di{' '}
                                    <strong>{lapangan.nama}</strong>. Lapangan
                                    ini dirancang dengan standar profesional,
                                    lantai berkualitas tinggi, dan pencahayaan
                                    yang optimal untuk permainan siang maupun
                                    malam.
                                </p>
                                <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <li className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />{' '}
                                        Lantai Standar Internasional
                                    </li>
                                    <li className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />{' '}
                                        Ruang Ganti Bersih
                                    </li>
                                    <li className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />{' '}
                                        Area Parkir Luas
                                    </li>
                                    <li className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />{' '}
                                        CCTV Keamanan 24 Jam
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Separator />

                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                            <h3 className="flex items-center gap-2 font-semibold text-blue-800 dark:text-blue-300">
                                <Info className="h-5 w-5" /> Aturan Pemesanan
                            </h3>
                            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-800 dark:text-neutral-200">
                                <li>
                                    Harap datang 15 menit sebelum jadwal main.
                                </li>
                                <li>
                                    Pembayaran dilakukan via transfer setelah
                                    konfirmasi WhatsApp.
                                </li>
                                <li>Pembatalan maksimal H-1 sebelum jadwal.</li>
                            </ul>
                        </div>
                    </div>

                    {/* KOLOM KANAN: FORM BOOKING (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Card className="overflow-hidden rounded-xl border shadow-lg">
                                <div className="bg-neutral-900 p-4 text-white">
                                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                                        <Calendar className="h-5 w-5" />
                                        Jadwal Main
                                    </h2>
                                </div>

                                <CardContent className="p-6">
                                    <form
                                        onSubmit={submit}
                                        className="space-y-5"
                                    >
                                        {/* Input Tanggal */}
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Label className="mb-2 font-semibold">
                                                    Pilih Tanggal
                                                </Label>
                                                <Input
                                                    type="date"
                                                    className=""
                                                    value={data.date}
                                                    onChange={(e) =>
                                                        setData(
                                                            'date',
                                                            e.target.value,
                                                        )
                                                    }
                                                    min={format(
                                                        new Date(),
                                                        'yyyy-MM-dd',
                                                    )}
                                                    required
                                                />
                                            </div>
                                            {errors.date && (
                                                <p className="text-xs text-red-500">
                                                    {errors.date}
                                                </p>
                                            )}
                                        </div>

                                        {/* Input Jam */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Label className="mb-2 font-semibold">
                                                        Mulai
                                                    </Label>
                                                    <Input
                                                        type="time"
                                                        value={data.start_time}
                                                        onChange={(e) =>
                                                            setData(
                                                                'start_time',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Label className="mb-2 font-semibold">
                                                        Selesai
                                                    </Label>
                                                    <Input
                                                        type="time"
                                                        value={data.end_time}
                                                        onChange={(e) =>
                                                            setData(
                                                                'end_time',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {(errors.start_time ||
                                            errors.end_time) && (
                                            <p className="text-xs text-red-500">
                                                Cek kembali jam mulai dan
                                                selesai
                                            </p>
                                        )}

                                        <Separator />

                                        {/* Kalkulasi Harga */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>Harga Sewa</span>
                                                <span>
                                                    {formatPrice(
                                                        lapangan.biaya_per_jam,
                                                    )}{' '}
                                                    x {durationHours || 0} jam
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
                                                <div className="flex items-center gap-2">
                                                    <Wallet className="h-5 w-5 text-green-600" />
                                                    <span className="font-semibold">
                                                        Total
                                                    </span>
                                                </div>
                                                <span className="text-xl font-bold text-green-600">
                                                    {totalPrice
                                                        ? formatPrice(
                                                              totalPrice,
                                                          )
                                                        : '-'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tombol Aksi */}
                                        <div className="grid gap-3 pt-2">
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full bg-[#25D366] font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#128C7E]"
                                                disabled={
                                                    processing ||
                                                    totalPrice === null
                                                }
                                            >
                                                {processing ? (
                                                    'Memproses...'
                                                ) : (
                                                    <>
                                                        <MessageCircle className="mr-2 h-5 w-5" />
                                                        Booking via WhatsApp
                                                    </>
                                                )}
                                            </Button>

                                            <NavigationButton
                                                href={lapanganIndex().url}
                                                variant="ghost"
                                                className="w-full"
                                            >
                                                Batal
                                            </NavigationButton>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import InputError from '@/components/input-error';
import NavigationButton from '@/components/navigation-button';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import formatPrice from '@/lib/format-price';
import { home } from '@/routes';
import { index as lapanganIndex } from '@/routes/lapangan';
import { store } from '@/routes/reservasi'; // Route store generic
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, MapPin, MessageCircle, Wallet } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Lapangan } from '../lapangan'; // Pastikan path import ini benar

interface Props {
    daftarLapangan: Lapangan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: home().url },
    { title: 'Lapangan', href: lapanganIndex().url },
    { title: 'Buat Reservasi', href: '#' },
];

export default function ReservasiCreateGeneric({ daftarLapangan }: Props) {
    const [durationHours, setDurationHours] = useState<number | null>(null);
    const [totalPrice, setTotalPrice] = useState<number | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        lapangan_id: '',
        date: '' as string,
        start_time: '',
        end_time: '',
    });

    // Cari object lapangan yang dipilih untuk ambil harganya
    const selectedLapangan = useMemo(() => {
        return daftarLapangan.find((l) => l.id.toString() === data.lapangan_id);
    }, [data.lapangan_id, daftarLapangan]);

    // Kalkulasi Harga Otomatis
    useEffect(() => {
        if (data.start_time && data.end_time && selectedLapangan) {
            const [startHour, startMinute] = data.start_time
                .split(':')
                .map(Number);
            const [endHour, endMinute] = data.end_time.split(':').map(Number);

            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;

            if (endMinutes > startMinutes) {
                const hours = (endMinutes - startMinutes) / 60;
                const price = hours * (selectedLapangan.biaya_per_jam ?? 0);
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
    }, [data.start_time, data.end_time, selectedLapangan]);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.lapangan_id) return alert('Pilih lapangan terlebih dahulu');
        if (!durationHours || !totalPrice)
            return alert('Cek kembali jam reservasi');

        post(store().url, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Reservasi Baru" />

            <div className="flex justify-center p-4 md:p-8">
                <Card className="w-full max-w-2xl border-0 bg-white/80 shadow-lg backdrop-blur dark:bg-neutral-900/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Calendar className="h-6 w-6 text-primary" />
                            Formulir Reservasi
                        </CardTitle>
                        <CardDescription>
                            Pilih lapangan dan tentukan jadwal main futsalmu.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* PILIH LAPANGAN */}
                            <div className="space-y-2">
                                <Label className="font-semibold">
                                    Pilih Lapangan
                                </Label>
                                <Select
                                    onValueChange={(val) =>
                                        setData('lapangan_id', val)
                                    }
                                    defaultValue={data.lapangan_id}
                                >
                                    <SelectTrigger className="h-12 bg-background">
                                        <SelectValue placeholder="-- Pilih Arena Futsal --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {daftarLapangan.map((lap) => (
                                            <SelectItem
                                                key={lap.id}
                                                value={lap.id.toString()}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {lap.nama}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        (
                                                        {formatPrice(
                                                            lap.biaya_per_jam,
                                                        )}
                                                        /jam)
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.lapangan_id} />
                            </div>

                            {/* TAMPILAN FOTO LAPANGAN (Jika sudah dipilih) */}
                            {selectedLapangan && (
                                <div className="relative h-40 w-full overflow-hidden rounded-lg border shadow-sm">
                                    {selectedLapangan.gambar ? (
                                        <img
                                            src={`/storage/${selectedLapangan.gambar}`}
                                            className="h-full w-full object-cover"
                                            alt={selectedLapangan.nama}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                            Tidak ada gambar
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
                                        <p className="font-bold text-white">
                                            {selectedLapangan.nama}
                                        </p>
                                        <p className="text-xs text-white/80">
                                            Kapasitas:{' '}
                                            {selectedLapangan.kapasitas} Orang
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Separator />

                            {/* INPUT TANGGAL */}
                            <div className="space-y-2">
                                <Label className="font-semibold">
                                    Tanggal Main
                                </Label>
                                <Input
                                    type="date"
                                    className="block h-11 w-full"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData('date', e.target.value)
                                    }
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                    required
                                />
                                <InputError message={errors.date} />
                            </div>

                            {/* INPUT JAM */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-semibold">
                                        Jam Mulai
                                    </Label>
                                    <div className="relative">
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
                                    <InputError message={errors.start_time} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-semibold">
                                        Jam Selesai
                                    </Label>
                                    <div className="relative">
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
                                    <InputError message={errors.end_time} />
                                </div>
                            </div>

                            {/* INFO HARGA */}
                            <div
                                className={`rounded-xl border p-5 transition-all ${
                                    totalPrice
                                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                                        : 'bg-muted/40'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Wallet
                                            className={`h-5 w-5 ${totalPrice ? 'text-green-600' : 'text-muted-foreground'}`}
                                        />
                                        <span className="font-medium">
                                            Total Bayar
                                        </span>
                                    </div>
                                    <span
                                        className={`text-2xl font-bold ${totalPrice ? 'text-green-600' : 'text-muted-foreground'}`}
                                    >
                                        {totalPrice
                                            ? formatPrice(totalPrice)
                                            : 'Rp 0'}
                                    </span>
                                </div>
                                {durationHours && (
                                    <p className="mt-1 text-right text-xs text-muted-foreground">
                                        ({durationHours} Jam x{' '}
                                        {formatPrice(
                                            selectedLapangan?.biaya_per_jam ??
                                                0,
                                        )}
                                        )
                                    </p>
                                )}
                            </div>

                            {/* TOMBOL AKSI */}
                            <div className="flex justify-end gap-3 pt-2">
                                <NavigationButton
                                    href={lapanganIndex().url}
                                    variant="outline"
                                >
                                    Batal
                                </NavigationButton>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="min-w-[200px] bg-[#25D366] font-bold text-white shadow-md hover:bg-[#128C7E]"
                                    disabled={processing || totalPrice === null}
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
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

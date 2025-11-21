import NavigationButton from '@/components/navigation-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import formatPrice from '@/lib/format-price';
import { home } from '@/routes';
import { index as lapanganIndex, show } from '@/routes/lapangan';
import { createFromLapangan, storeFromLapangan } from '@/routes/reservasi';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Lapangan } from '../lapangan';

interface Props {
    lapangan: Lapangan;
}

const breadcrumbs = (lapangan: Lapangan): BreadcrumbItem[] => [
    { title: 'Home', href: home().url },
    { title: 'Lapangan', href: lapanganIndex().url },
    { title: lapangan.nama, href: show(lapangan).url },
    { title: 'Reservasi', href: createFromLapangan(lapangan).url },
];

export default function ReservasiCreate({ lapangan }: Props) {
    const [durationHours, setDurationHours] = useState<number | null>(null);
    const [totalPrice, setTotalPrice] = useState<number | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        date: '' as string,
        start_time: '',
        end_time: '',
    });

    // Hitung durasi & total harga setiap kali start_time atau end_time berubah
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
            alert('Pilih tanggal terlebih dahulu');
            return;
        }
        if (!durationHours || !totalPrice) {
            alert('Pastikan jam selesai lebih besar dari jam mulai');
            return;
        }

        post(storeFromLapangan(lapangan).url, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(lapangan)}>
            <Head title={`Reservasi - ${lapangan.nama}`} />

            <div className="flex justify-center p-4">
                <Card className="w-xl">
                    <CardContent>
                        <form onSubmit={submit}>
                            <FieldSet>
                                <FieldLegend>{lapangan.nama}</FieldLegend>
                                <FieldDescription>
                                    Rp {formatPrice(lapangan.biaya_per_jam)} /
                                    jam
                                </FieldDescription>

                                <FieldGroup>
                                    {/* TANGGAL */}
                                    <Field orientation="vertical">
                                        <FieldContent>
                                            <FieldLabel>
                                                Tanggal Sewa
                                            </FieldLabel>
                                            <FieldDescription>
                                                Pilih tanggal yang ingin Anda
                                                pesan
                                            </FieldDescription>
                                        </FieldContent>

                                        <div className="relative">
                                            <Input
                                                type="date"
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
                                            <CalendarIcon className="pointer-events-none absolute top-3 right-3 h-4 w-4 text-muted-foreground" />
                                        </div>
                                        {errors.date && (
                                            <FieldError>
                                                {errors.date}
                                            </FieldError>
                                        )}
                                    </Field>

                                    {/* JAM MULAI */}
                                    <Field orientation="vertical">
                                        <FieldContent>
                                            <FieldLabel>Jam Mulai</FieldLabel>
                                            <FieldDescription>
                                                Contoh: 08:00
                                            </FieldDescription>
                                        </FieldContent>
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
                                        {errors.start_time && (
                                            <FieldError>
                                                {errors.start_time}
                                            </FieldError>
                                        )}
                                    </Field>

                                    {/* JAM SELESAI */}
                                    <Field orientation="vertical">
                                        <FieldContent>
                                            <FieldLabel>Jam Selesai</FieldLabel>
                                            <FieldDescription>
                                                Contoh: 10:00
                                            </FieldDescription>
                                        </FieldContent>
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
                                        {errors.end_time && (
                                            <FieldError>
                                                {errors.end_time}
                                            </FieldError>
                                        )}
                                    </Field>

                                    {/* RINGKASAN HARGA (Tampil otomatis) */}
                                    {durationHours !== null &&
                                        totalPrice !== null && (
                                            <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                                                <div className="flex justify-between text-sm">
                                                    <span>Durasi</span>
                                                    <span className="font-medium">
                                                        {durationHours} jam
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-lg font-semibold">
                                                    <span>Total Biaya</span>
                                                    <span className="text-primary">
                                                        Rp{' '}
                                                        {totalPrice.toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                    {/* TOMBOL */}
                                    <Field
                                        orientation="responsive"
                                        className="mt-6 flex justify-end gap-3"
                                    >
                                        <NavigationButton
                                            href={lapanganIndex().url}
                                        >
                                            Batal
                                        </NavigationButton>
                                        <Button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                totalPrice === null
                                            }
                                            className="min-w-40"
                                        >
                                            {processing
                                                ? 'Mengajukan...'
                                                : totalPrice === null
                                                  ? 'Isi Jam Terlebih Dahulu'
                                                  : `Ajukan Reservasi (Rp ${totalPrice.toLocaleString('id-ID')})`}
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

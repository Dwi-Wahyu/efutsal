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
    FieldSeparator,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { edit, index, store } from '@/routes/lapangan';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Lapangan } from '.';

export default function EditLapangan({ lapangan }: { lapangan: Lapangan }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Data Lapangan',
            href: '/data-lapangan',
        },
        {
            title: 'Edit Lapangan',
            href: edit(lapangan).url,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        nama: lapangan.nama,
        gambar: lapangan.gambar,
        kapasitas: lapangan.kapasitas,
        biaya_per_jam: lapangan.biaya_per_jam,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Panggil Inertia post. Inertia otomatis menangani File Upload (multipart/form-data)
        post(store().url, {
            onSuccess: () => {
                // Redirect akan terjadi jika Controller Laravel mengirimkan redirect()->route()
                console.log('Submit berhasil, menunggu redirect...');
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Lapangan" />

            <Card className="m-4 mx-auto w-xl">
                <CardContent>
                    <form onSubmit={submit}>
                        <FieldSet>
                            <FieldLegend>Edit Data Lapangan</FieldLegend>
                            <FieldDescription>
                                Masukkan detail lapangan baru.
                            </FieldDescription>

                            <FieldSeparator />

                            <FieldGroup>
                                {/* INPUT NAMA LAPANGAN */}
                                <Field orientation="vertical">
                                    <FieldContent>
                                        <FieldLabel htmlFor="nama">
                                            Nama Lapangan
                                        </FieldLabel>
                                    </FieldContent>
                                    <Input
                                        id="nama"
                                        placeholder="Nama Lapangan"
                                        value={data.nama}
                                        onChange={(e) =>
                                            setData('nama', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.nama && (
                                        <FieldError>{errors.nama}</FieldError>
                                    )}
                                </Field>

                                {/* <FieldSeparator /> */}

                                {/* INPUT GAMBAR */}
                                {/* <Field orientation="responsive">
                                    <FieldContent>
                                        <FieldLabel htmlFor="gambar">
                                            Gambar Lapangan
                                        </FieldLabel>
                                        <FieldDescription>
                                            Unggah foto lapangan (Maks. 2MB)
                                        </FieldDescription>
                                    </FieldContent>
                                    <Input
                                        id="gambar"
                                        type="file"
                                        // PENTING: Untuk file, ambil objek file pertama (e.target.files[0])
                                        onChange={(e) =>
                                            setData(
                                                'gambar',
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                    />
                                    {errors.gambar && (
                                        <FieldError>{errors.gambar}</FieldError>
                                    )}
                                </Field> */}

                                {/* INPUT KAPASITAS */}
                                <Field orientation="vertical">
                                    <FieldContent>
                                        <FieldLabel htmlFor="kapasitas">
                                            Kapasitas
                                        </FieldLabel>
                                    </FieldContent>
                                    <Input
                                        id="kapasitas"
                                        type="number"
                                        placeholder="Contoh: 20"
                                        // Gunakan helper untuk menangani null/string kosong
                                        value={data.kapasitas ?? ''}
                                        onChange={(e) => {
                                            const parsed = parseInt(
                                                e.target.value,
                                            );
                                            if (!isNaN(parsed)) {
                                                setData('kapasitas', parsed);
                                            } else {
                                                setData('kapasitas', 0);
                                            }
                                        }}
                                        required
                                    />
                                    {errors.kapasitas && (
                                        <FieldError>
                                            {errors.kapasitas}
                                        </FieldError>
                                    )}
                                </Field>

                                {/* INPUT BIAYA PER JAM */}
                                <Field orientation="vertical">
                                    <FieldContent>
                                        <FieldLabel htmlFor="biaya_per_jam">
                                            Biaya per Jam (Rp)
                                        </FieldLabel>
                                    </FieldContent>
                                    <Input
                                        id="biaya_per_jam"
                                        type="number"
                                        placeholder="Contoh: 150000"
                                        value={data.biaya_per_jam ?? ''}
                                        onChange={(e) => {
                                            const parsed = parseInt(
                                                e.target.value,
                                            );
                                            if (!isNaN(parsed)) {
                                                setData(
                                                    'biaya_per_jam',
                                                    parsed,
                                                );
                                            } else {
                                                setData('biaya_per_jam', 0);
                                            }
                                        }}
                                        required
                                    />
                                    {errors.biaya_per_jam && (
                                        <FieldError>
                                            {errors.biaya_per_jam}
                                        </FieldError>
                                    )}
                                </Field>

                                {/* TOMBOL SUBMIT DAN CANCEL */}
                                <Field
                                    orientation="responsive"
                                    className="flex justify-end"
                                >
                                    <NavigationButton href={index().url}>
                                        Batal
                                    </NavigationButton>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Data Lapangan'}
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}

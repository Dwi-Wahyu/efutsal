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
import { index, update } from '@/routes/lapangan'; // Hanya perlu update dan index
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react'; // Import useMemo untuk pratinjau
import { Lapangan } from '.';

export default function EditLapangan({ lapangan }: { lapangan: Lapangan }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Data Lapangan',
            href: '/data-lapangan',
        },
        {
            title: 'Edit Lapangan',
            // Gunakan route update untuk mendapatkan URL edit yang benar
            href: update(lapangan).url,
        },
    ];

    // Inisialisasi useForm
    const { data, setData, post, processing, errors } = useForm({
        // Gunakan PUT method untuk update (Inertia akan mengubahnya menjadi POST
        // dengan field tersembunyi _method=PUT untuk file upload)
        _method: 'put',
        nama: lapangan.nama,

        // PENTING: Gambar harus diinisialisasi sebagai null atau File | string.
        // String gambar lama HANYA berfungsi sebagai placeholder/penanda gambar.
        // Ketika file baru diupload, properti ini akan diganti dengan File object.
        // Jika tidak ada upload, inertia akan mengabaikan properti ini.
        gambar: null as File | null, // Inisialisasi sebagai File object yang baru diupload
        kapasitas: lapangan.kapasitas,
        biaya_per_jam: lapangan.biaya_per_jam,
    });

    // Gunakan useMemo untuk membuat URL pratinjau gambar yang baru diupload
    const newImageUrl = useMemo(() => {
        if (data.gambar instanceof File) {
            return URL.createObjectURL(data.gambar);
        }
        return null;
    }, [data.gambar]);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // PENTING: Panggil Inertia post/put dan arahkan ke route update()
        post(update(lapangan).url, {
            onSuccess: () => {
                console.log('Update berhasil.');
            },
            // Force file upload handling
            forceFormData: true,
            preserveScroll: true,
        });
    };

    // Helper untuk menangani perubahan pada input teks/angka (Menghindari string kosong pada number)
    const handleNumberChange = (
        key: 'kapasitas' | 'biaya_per_jam',
        value: string,
    ) => {
        setData(key, value === '' ? 0 : parseInt(value));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Lapangan" />

            <Card className="m-4 mx-auto w-xl">
                <CardContent>
                    {/* Hapus atribut method dan action dari form HTML jika menggunakan Inertia */}
                    <form onSubmit={submit}>
                        <FieldSet>
                            <FieldLegend>Edit Data Lapangan</FieldLegend>
                            <FieldDescription>
                                Masukkan detail lapangan baru.
                            </FieldDescription>

                            <FieldSeparator />

                            <FieldGroup>
                                {/* INPUT NAMA (TIDAK BERUBAH) */}
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

                                {/* INPUT GAMBAR (PERBAIKAN) */}
                                <Field orientation="vertical">
                                    <FieldContent>
                                        <FieldLabel htmlFor="gambar">
                                            Gambar Lapangan
                                        </FieldLabel>
                                        <FieldDescription>
                                            Unggah foto lapangan baru untuk
                                            mengganti gambar lama (Maks. 2MB)
                                        </FieldDescription>
                                    </FieldContent>

                                    {/* 1. TAMPILKAN GAMBAR LAMA/BARU */}
                                    {(lapangan.gambar || newImageUrl) && (
                                        <div className="mb-4">
                                            <p className="mb-1 text-sm font-medium">
                                                Gambar Saat Ini:
                                            </p>
                                            <img
                                                // Jika ada gambar baru di form, tampilkan pratinjau
                                                src={
                                                    newImageUrl ||
                                                    '/storage/' +
                                                        lapangan.gambar
                                                }
                                                alt="Gambar Lapangan Saat Ini"
                                                className="h-32 w-48 rounded border border-gray-200 object-cover shadow-lg"
                                            />
                                            {newImageUrl && (
                                                <p className="mt-1 text-xs text-green-600">
                                                    (Pratinjau Gambar Baru)
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* 2. INPUT FILE UNTUK UPLOAD */}
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

                                    {/* 3. TAMPILKAN ERROR */}
                                    {errors.gambar && (
                                        <FieldError>{errors.gambar}</FieldError>
                                    )}

                                    {/* 4. TOMBOL HAPUS GAMBAR (OPSIONAL) */}
                                    {lapangan.gambar && !newImageUrl && (
                                        <FieldDescription className="mt-2 text-red-500">
                                            Catatan: Jika Anda menyimpan tanpa
                                            mengunggah file baru, gambar yang
                                            ada akan dipertahankan.
                                        </FieldDescription>
                                    )}
                                </Field>

                                {/* INPUT KAPASITAS (TIDAK BERUBAH) */}
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
                                        value={data.kapasitas ?? ''}
                                        onChange={(e) => {
                                            handleNumberChange(
                                                'kapasitas',
                                                e.target.value,
                                            );
                                        }}
                                        required
                                    />
                                    {errors.kapasitas && (
                                        <FieldError>
                                            {errors.kapasitas}
                                        </FieldError>
                                    )}
                                </Field>

                                {/* INPUT BIAYA PER JAM (TIDAK BERUBAH) */}
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
                                            handleNumberChange(
                                                'biaya_per_jam',
                                                e.target.value,
                                            );
                                        }}
                                        required
                                    />
                                    {errors.biaya_per_jam && (
                                        <FieldError>
                                            {errors.biaya_per_jam}
                                        </FieldError>
                                    )}
                                </Field>

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

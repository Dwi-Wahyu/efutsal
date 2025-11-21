import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { destroy } from '@/routes/lapangan';
import { Link } from '@inertiajs/react';
import { Lapangan } from '.';

export function DeleteLapanganAlertDialog({
    lapangan,
}: {
    lapangan: Lapangan;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="cursor-pointer" variant="destructive">
                    Hapus
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Yakin Menghapus Lapangan Ini
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan tidak dapat dibatalkan
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>

                    <Button asChild variant={'destructive'}>
                        <Link href={destroy(lapangan)}>Yakin</Link>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

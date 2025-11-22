import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative container grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* --- SISI KIRI: ILUSTRASI GAMBAR --- */}
            {/* <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900">
                    <img
                        src="/efutsal-auth-layout-bg.avif"
                        alt="Futsal Court Background"
                        className="h-full w-full object-cover opacity-50"
                    />
                </div>

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <AppLogoIcon className="mr-2 h-8 w-8 fill-current text-white" />
                </div>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Atur jadwal pertandingan tim kamu tanpa
                            ribet. Cek lapangan, booking, dan main langsung dari
                            genggaman.&rdquo;
                        </p>
                        <footer className="text-sm text-zinc-300">
                            Start your match today.
                        </footer>
                    </blockquote>
                </div>
            </div> */}

            <div className="bg-[url('/efutsal-auth-layout-bg.avif')]">
                <AppLogoIcon className="mr-2 h-8 w-8 fill-current text-white" />
            </div>

            {/* --- SISI KANAN: FORMULIR --- */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {/* Header Form (Logo Mobile & Judul) */}
                    <div className="flex flex-col space-y-2 text-center">
                        {/* Logo hanya muncul di mobile */}
                        <div className="mb-4 flex justify-center lg:hidden">
                            <AppLogoIcon className="h-10 w-10 fill-current text-primary" />
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}

                    {/* Footer Links */}
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Dengan login, Anda menyetujui{' '}
                        <Link
                            href="#"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Syarat & Ketentuan
                        </Link>{' '}
                        kami.
                    </p>
                </div>
            </div>
        </div>
    );
}

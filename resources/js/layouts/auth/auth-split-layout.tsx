import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent } from '@/components/ui/card';
import { home } from '@/routes';
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
        <div className="h-screen bg-[url('/efutsal-auth-layout-bg.avif')] bg-cover bg-center">
            <div className="flex h-full w-full flex-col items-center justify-center bg-black/50 p-5">
                <Link href={home()} className="mb-5">
                    <AppLogoIcon className="h-20 w-20" />
                </Link>
                <Card>
                    <CardContent>
                        <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        </div>
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

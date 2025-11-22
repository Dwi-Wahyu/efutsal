import { Link } from '@inertiajs/react';
import { type VariantProps } from 'class-variance-authority';
import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';
import { Button, buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';

type NavigationButtonProps = {
    type?: 'button' | 'icon';
    href: string;
    children?: ReactNode;
    variant?: VariantProps<typeof buttonVariants>['variant'];
    className?: string; // <--- Kita tambahkan ini agar tidak error
};

export default function NavigationButton({
    type = 'button',
    href,
    children,
    variant = 'outline',
    className, // <--- Terima props className
}: NavigationButtonProps) {
    if (type === 'icon') {
        return (
            <Link href={href} className={className}>
                <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            </Link>
        );
    }

    if (children) {
        return (
            // Teruskan className ke komponen Button
            <Button type="button" variant={variant} className={cn(className)} asChild>
                <Link href={href}>{children}</Link>
            </Button>
        );
    }

    return (
        <Button type="button" variant={variant} className={cn(className)} asChild>
            <Link href={href}>Kembali</Link>
        </Button>
    );
}
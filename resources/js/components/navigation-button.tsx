import { Link } from '@inertiajs/react';
import { type VariantProps } from 'class-variance-authority';
import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';
import { Button, buttonVariants } from './ui/button';

type NavigationButtonProps = {
    type?: 'button' | 'icon';
    href: string;
    children?: ReactNode;
    variant?: VariantProps<typeof buttonVariants>['variant'];
};

export default function NavigationButton({
    type = 'button',
    href,
    children,
    variant = 'outline',
}: NavigationButtonProps) {
    if (type === 'icon') {
        return (
            <Link href={href}>
                <ChevronLeft className="h-5 w-5" />
            </Link>
        );
    }

    if (children) {
        return (
            <Button type="button" variant={variant} asChild>
                <Link href={href}>{children}</Link>
            </Button>
        );
    }

    return (
        <Button type="button" variant={variant} asChild>
            <Link href={href}>Kembali</Link>
        </Button>
    );
}

// File ini berfungsi untuk memberitahu TypeScript bahwa props global Inertia
// HARUS mencakup properti yang kita bagi dari backend.

import '@inertiajs/core';
import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

// --- DEFINISI APLIKASI KUSTOM ---

export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean; // Nilai boolean dari Laravel cast
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Auth {
    user: User | null; // Penting: Bisa null jika user belum login
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

// --- DEFINISI PROPS GLOBAL (SHARED DATA) ---
export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// --- INERTIA EXTENSION (KRITIS) ---
// Bagian ini memberitahu TypeScript untuk menggabungkan SharedData ke dalam
// PageProps default dari paket Inertia.
// Ini diperlukan agar TypeScript mengenali properti 'auth', 'name', dll.
declare module '@inertiajs/core' {
    interface PageProps extends SharedData {}
}

declare module '@inertiajs/react' {
    // Memperluas tipe di sini juga memastikan usePage() hook
    // di React memiliki typing yang benar.
    interface PageProps extends SharedData {}
}

// Catatan: Setelah ini, Anda dapat mengakses usePage().props.auth.user.is_admin
// tanpa error typing.

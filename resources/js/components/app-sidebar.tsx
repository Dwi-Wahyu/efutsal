import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import { index } from '@/routes/lapangan';

import { index as adminReservasiIndex } from '@/routes/admin/reservasi';
import { index as userReservasiIndex } from '@/routes/reservasi';
import { type NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { Home, LayoutGrid, Mails, Volleyball } from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Data Lapangan',
        href: index(),
        icon: Volleyball,
    },
    {
        title: 'Pengajuan Reservasi',
        href: adminReservasiIndex(),
        icon: Mails,
    },
];

const userNavItems: NavItem[] = [
    {
        title: 'Home',
        href: home(),
        icon: Home,
    },
    {
        title: 'Pengajuan Reservasi',
        href: userReservasiIndex(),
        icon: Mails,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;

    if (!auth.user) {
        return (
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem className="flex items-center gap-2">
                            <AppLogo />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
            </Sidebar>
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <AppLogo />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain
                    items={auth.user.is_admin ? adminNavItems : userNavItems}
                />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Activity, CalendarCheck, DollarSign, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    // Gunakan SharedData agar TypeScript mengenali struktur auth
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // FIX: Tambahkan pengecekan ini.
    // Jika user null (belum login), jangan render apa-apa atau redirect.
    // Ini menghilangkan error "user is possibly null".
    if (!user) {
        return null;
    }

    // Data Dummy untuk Visualisasi (Nanti bisa diambil dari backend)
    const stats = [
        {
            title: "Total Pendapatan",
            value: "Rp 12.500.000",
            desc: "+20.1% dari bulan lalu",
            icon: DollarSign,
            color: "text-green-500"
        },
        {
            title: "Reservasi Bulan Ini",
            value: "+150",
            desc: "+180 jam terbooking",
            icon: CalendarCheck,
            color: "text-blue-500"
        },
        {
            title: "User Aktif",
            value: "2,350",
            desc: "+19 user baru minggu ini",
            icon: Users,
            color: "text-orange-500"
        },
        {
            title: "Rata-rata Okupansi",
            value: "85%",
            desc: "Lapangan A paling favorit",
            icon: Activity,
            color: "text-purple-500"
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="p-6 space-y-8">
                {/* WELCOME SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Halo, {user.name} 👋</h1>
                        <p className="text-muted-foreground mt-1">
                            {user.is_admin 
                                ? "Ini ringkasan performa bisnis futsalmu hari ini."
                                : "Siap untuk pertandingan berikutnya? Cek jadwalmu di sini."}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* STATS GRID (Hanya Tampil jika Admin) */}
                {user.is_admin && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stat.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* MAIN CONTENT AREA */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    
                    {/* CHART AREA (Placeholder) */}
                    <Card className="col-span-4 shadow-sm">
                        <CardHeader>
                            <CardTitle>Grafik Reservasi Mingguan</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 pb-4">
                                {/* Fake Bars */}
                                {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                                    <div key={i} className="w-full bg-primary/10 hover:bg-primary/20 rounded-t-md relative group transition-all" style={{ height: `${h}%` }}>
                                        <div className="absolute bottom-0 w-full h-0 bg-primary transition-all duration-500 group-hover:h-full rounded-t-md opacity-20"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between px-4 text-xs text-muted-foreground">
                                <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RECENT ACTIVITY */}
                    <Card className="col-span-3 shadow-sm">
                        <CardHeader>
                            <CardTitle>Aktivitas Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <div className="flex items-center" key={i}>
                                        <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800 items-center justify-center">
                                            <TrendingUp className="h-4 w-4" />
                                        </span>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Reservasi Baru Masuk</p>
                                            <p className="text-xs text-muted-foreground">
                                                User #{1020 + i} memesan Lapangan A
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-sm text-green-600">
                                            +Rp 150.000
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
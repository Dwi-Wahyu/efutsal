<?php

namespace App\Http\Controllers;

use App\Enums\ReservasiStatus;
use App\Models\Reservasi;
use App\Http\Requests\StoreReservasiRequest;
use App\Http\Requests\UpdateReservasiRequest;
use App\Models\Lapangan;
use Carbon\Carbon;
use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservasiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('reservasi/index');
    }

    public function indexAdmin()
    {
        $daftarReservasi = Reservasi::with(['user', 'lapangan'])
            ->latest()
            ->get()
            ->map(function ($reservasi) {
                return [
                    'id' => $reservasi->id,
                    'user_name' => $reservasi->user->name ?? 'User Terhapus',
                    'lapangan_nama' => $reservasi->lapangan->nama ?? 'Lapangan Terhapus',
                    'tanggal_main' => $reservasi->date->format('d M Y'),
                    'jam_mulai'    => $reservasi->start_time->format('H:i'),
                    'jam_selesai'  => $reservasi->end_time->format('H:i'),
                    'total_harga'  => 'Rp ' . number_format($reservasi->total_price, 0, ',', '.'),
                    'status' => $reservasi->status,
                    'durasi' => $reservasi->duration_hours . ' Jam',
                ];
            });

        return Inertia::render('reservasi/admin/index', [
            'daftarReservasi' => $daftarReservasi
        ]);
    }

    public function create()
    {   
        return Inertia::render('reservasi/create');
    }

    public function createFromLapangan(Lapangan $lapangan)
    {   
        return Inertia::render('reservasi/create-from-lapangan', [
            'lapangan' => $lapangan
        ]);
    }

    public function store(StoreReservasiRequest $request)
    {
        // Kosong, kita pakai storeFromLapangan
    }

    /**
     * LOGIKA UTAMA: Simpan & Redirect ke WhatsApp dengan Link Aksi
     */
    public function storeFromLapangan(StoreReservasiRequest $request, Lapangan $lapangan, WhatsAppService $waService)
    {
        $date       = $request->validated('date');
        $startTime  = $request->validated('start_time');
        $endTime    = $request->validated('end_time');
        $user       = Auth::user();

        $start = Carbon::createFromFormat('Y-m-d H:i', "$date $startTime");
        $end   = Carbon::createFromFormat('Y-m-d H:i', "$date $endTime");

        $durationHours = $start->diffInHours($end);
        $totalPrice    = $durationHours * $lapangan->biaya_per_jam;

        // 1. Simpan data
        $reservasi = Reservasi::create([
            'lapangan_id'     => $lapangan->id,
            'user_id'         => $user->id,
            'date'            => $date,
            'start_time'      => $start,
            'end_time'        => $end,
            'duration_hours'  => $durationHours,
            'total_price'     => $totalPrice,
            'status'          => ReservasiStatus::Pending,
        ]);

        // 2. Generate Link Aksi untuk Admin
        // Link ini akan muncul di chat WA. Jika admin klik, status di DB berubah.
        $approveLink = route('admin.reservasi.approve', $reservasi->id);
        $rejectLink  = route('admin.reservasi.reject', $reservasi->id);

        // 3. Format Pesan WhatsApp
        $nomorAdmin = '6285342505228'; // Ganti dengan nomor admin asli

        $text  = "*PENGAJUAN BOOKING BARU #{$reservasi->id}*\n\n";
        $text .= "Halo Admin, mohon proses pesanan ini:\n\n";
        $text .= "*Pemesan:* " . $user->name . "\n";
        $text .= "*Lapangan:* " . $lapangan->nama . "\n";
        $text .= "*Jadwal:* " . $start->translatedFormat('d F Y') . ", " . $start->format('H:i') . "-" . $end->format('H:i') . "\n";
        $text .= "*Total:* Rp " . number_format($totalPrice, 0, ',', '.') . "\n\n";
        
        $text .= "*AKSI ADMIN (KLIK LINK DI BAWAH)* 👇\n\n";
        $text .= "*TERIMA / KONFIRMASI:*\n";
        $text .= $approveLink . "\n\n";
        $text .= "*TOLAK / BATALKAN:*\n";
        $text .= $rejectLink . "\n\n";
        
        $text .= "------------------------------\n";
        $text .= "Mohon infokan nomor rekening jika diterima.";

        $encodedMessage = urlencode($text);
        $whatsappUrl = "https://wa.me/{$nomorAdmin}?text={$encodedMessage}";

        return Inertia::location($whatsappUrl);
    }

    /**
     * AKSI ADMIN: Terima Pesanan (Via Link WA)
     */
    public function approve(Reservasi $reservasi)
    {
        // Validasi: Hanya admin yang boleh akses (opsional, bisa tambah middleware)
        if (!Auth::user()->is_admin) {
            abort(403, 'Unauthorized action.');
        }

        $reservasi->update(['status' => ReservasiStatus::Confirmed]);

        return redirect()->route('admin_reservasi_index')
            ->with('success', "Reservasi #{$reservasi->id} berhasil DITERIMA ✅");
    }

    /**
     * AKSI ADMIN: Tolak Pesanan (Via Link WA)
     */
    public function reject(Reservasi $reservasi)
    {
        if (!Auth::user()->is_admin) {
            abort(403, 'Unauthorized action.');
        }

        $reservasi->update(['status' => ReservasiStatus::Cancelled]);

        return redirect()->route('admin_reservasi_index')
            ->with('success', "Reservasi #{$reservasi->id} berhasil DITOLAK ❌");
    }

    public function show(Reservasi $reservasi)
    {
        return Inertia::render('reservasi/show', [ 
            'reservasi' => $reservasi, 
        ]);
    }

    public function edit(Reservasi $reservasi)
    {
        //
    }

    public function update(UpdateReservasiRequest $request, Reservasi $reservasi)
    {
        //
    }

    public function destroy(Reservasi $reservasi)
    {
        //
    }
}
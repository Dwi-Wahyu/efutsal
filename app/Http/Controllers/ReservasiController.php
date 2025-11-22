<?php

namespace App\Http\Controllers;

use App\Enums\ReservasiStatus;
use App\Models\Reservasi;
use App\Http\Requests\StoreReservasiRequest;
use App\Models\Lapangan;
use Carbon\Carbon;
use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservasiController extends Controller
{
    /**
     * Menampilkan Riwayat Reservasi User
     */
    public function index()
    {
        $user = Auth::user();

        $riwayatReservasi = Reservasi::with('lapangan')
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($item) {
                $sekarang = Carbon::now();
                $isExpired = $sekarang->greaterThan($item->end_time);
                
                $displayStatus = $item->status->value;
                
                if ($isExpired && $item->status === ReservasiStatus::Confirmed) {
                    $displayStatus = 'completed';
                } elseif ($isExpired && $item->status === ReservasiStatus::Pending) {
                    $displayStatus = 'expired';
                }

                return [
                    'id' => $item->id,
                    'lapangan_nama' => $item->lapangan->nama,
                    'lapangan_gambar' => $item->lapangan->gambar,
                    'tanggal' => $item->date->translatedFormat('l, d F Y'), 
                    'jam' => $item->start_time->format('H:i') . ' - ' . $item->end_time->format('H:i'),
                    'total_harga' => 'Rp ' . number_format($item->total_price, 0, ',', '.'),
                    'status' => $displayStatus, 
                    'note' => $item->note, 
                ];
            });

        return Inertia::render('reservasi/index', [
            'riwayatReservasi' => $riwayatReservasi
        ]);
    }

    /**
     * Dashboard Admin: Menampilkan Daftar Pengajuan
     */
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
                    
                    // PERBAIKAN 1: Format tanggal & jam agar tampil di tabel admin
                    'tanggal_main' => $reservasi->date->translatedFormat('d M Y'),
                    // Gabungkan jam mulai & selesai jadi satu string 'jam'
                    'jam' => $reservasi->start_time->format('H:i') . ' - ' . $reservasi->end_time->format('H:i'),
                    
                    'total_harga'  => 'Rp ' . number_format($reservasi->total_price, 0, ',', '.'),
                    'status' => $reservasi->status,
                    'durasi' => $reservasi->duration_hours . ' Jam',
                    'note' => $reservasi->note,
                ];
            });

        return Inertia::render('reservasi/admin/index', [
            'daftarReservasi' => $daftarReservasi
        ]);
    }

    public function create()
    {   
        $daftarLapangan = Lapangan::all();

        return Inertia::render('reservasi/create', [
            'daftarLapangan' => $daftarLapangan,
        ]);
    }

    public function createFromLapangan(Lapangan $lapangan)
    {   
        return Inertia::render('reservasi/create-from-lapangan', [
            'lapangan' => $lapangan
        ]);
    }

    /**
     * Simpan dari Form Generic (Pilih Lapangan Sendiri)
     */
    public function store(Request $request)
    {
        // Validasi Input
        $validated = $request->validate([
            'lapangan_id' => 'required|exists:lapangan,id',
            'date'        => 'required|date|after_or_equal:today',
            'start_time'  => 'required|date_format:H:i',
            'end_time'    => 'required|date_format:H:i|after:start_time',
        ]);

        $user = Auth::user();
        $lapangan = Lapangan::findOrFail($validated['lapangan_id']);

        // Buat objek Carbon untuk waktu mulai dan selesai
        $start = Carbon::createFromFormat('Y-m-d H:i', "{$validated['date']} {$validated['start_time']}");
        $end   = Carbon::createFromFormat('Y-m-d H:i', "{$validated['date']} {$validated['end_time']}");

        // --- PERBAIKAN 2: Cek Bentrok Jadwal (Hanya jika status Confirmed) ---
        $isBooked = Reservasi::where('lapangan_id', $lapangan->id)
            ->where('status', ReservasiStatus::Confirmed) // Hanya cek yang sudah disetujui admin
            ->where(function ($query) use ($start, $end) {
                // Logika overlap: 
                // Jadwal baru mulai sebelum jadwal lama selesai DAN jadwal baru selesai setelah jadwal lama mulai
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })
            ->exists();

        if ($isBooked) {
            // Kembalikan error ke frontend agar muncul di form
            return back()->withErrors([
                'start_time' => 'Maaf, jadwal pada jam tersebut sudah penuh (Disetujui Admin). Silakan pilih jam atau lapangan lain.',
            ]);
        }
        // --------------------------------------------------------------------

        $durationHours = $start->diffInHours($end);
        $totalPrice    = $durationHours * $lapangan->biaya_per_jam;

        $reservasi = Reservasi::create([
            'lapangan_id'     => $lapangan->id,
            'user_id'         => $user->id,
            'date'            => $validated['date'],
            'start_time'      => $start,
            'end_time'        => $end,
            'duration_hours'  => $durationHours,
            'total_price'     => $totalPrice,
            'status'          => ReservasiStatus::Pending,
        ]);

        // Logika WhatsApp
        $approveUrl = route('admin.reservasi.approve', $reservasi->id);
        $rejectUrl  = route('admin.reservasi.reject', $reservasi->id);
        $nomorAdmin = '6289643144013'; 

        $text  = "📢 *ORDER BARU MASUK #{$reservasi->id}*\n";
        $text .= "──────────────────\n";
        $text .= "👤 *Pemesan:* " . $user->name . "\n";
        $text .= "🏟 *Lapangan:* " . $lapangan->nama . "\n";
        $text .= "📅 *Main:* " . $start->translatedFormat('d F Y') . "\n";
        $text .= "⏰ *Jam:* " . $start->format('H:i') . " - " . $end->format('H:i') . "\n";
        $text .= "💰 *Total:* Rp " . number_format($totalPrice, 0, ',', '.') . "\n";
        $text .= "──────────────────\n\n";
        
        $text .= "Admin, silakan klik link di bawah untuk konfirmasi:\n\n";
        $text .= "✅  *TERIMA PESANAN*\n";
        $text .= $approveUrl . "\n\n";
        $text .= "❌  *TOLAK PESANAN*\n";
        $text .= $rejectUrl . "\n\n";
        $text .= "⚠️ _Link ini otomatis mengubah status di sistem._";

        $whatsappUrl = "https://wa.me/{$nomorAdmin}?text=" . urlencode($text);

        return Inertia::location($whatsappUrl);
    }

    /**
     * Simpan dari Halaman Detail Lapangan
     */
    /**
     * LOGIKA UTAMA: Store dari Halaman Detail Lapangan
     */
    public function storeFromLapangan(StoreReservasiRequest $request, Lapangan $lapangan, WhatsAppService $waService)
    {
        $date       = $request->validated('date');
        $startTime  = $request->validated('start_time');
        $endTime    = $request->validated('end_time');
        $user       = Auth::user();

        $start = Carbon::createFromFormat('Y-m-d H:i', "$date $startTime");
        $end   = Carbon::createFromFormat('Y-m-d H:i', "$date $endTime");

        // --------------------------------------------------------------------
        // CEK JADWAL BENTROK (Anti Double Booking)
        // --------------------------------------------------------------------
        $isBooked = Reservasi::where('lapangan_id', $lapangan->id)
            ->where('status', ReservasiStatus::Confirmed) // Hanya cek yang sudah DISETUJUI Admin
            ->where(function ($query) use ($start, $end) {
                // Logika Tabrakan Waktu:
                // Jadwal baru (Start) < Jadwal lama (End)  DAN  Jadwal baru (End) > Jadwal lama (Start)
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })
            ->exists();

        // Jika sudah ada yang booking & status confirmed:
        if ($isBooked) {
            // Kembalikan error ke frontend (Inertia akan menangkap ini di props.errors)
            return back()->withErrors([
                'start_time' => 'GAGAL: Lapangan sudah dibooking orang lain di jam ini (Disetujui Admin).',
            ]);
        }
        // --------------------------------------------------------------------

        $durationHours = $start->diffInHours($end);
        $totalPrice    = $durationHours * $lapangan->biaya_per_jam;

        // Simpan Data (Status Pending)
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

        // Logika WhatsApp (Sama seperti sebelumnya)
        $approveUrl = route('admin.reservasi.approve', $reservasi->id);
        $rejectUrl  = route('admin.reservasi.reject', $reservasi->id);
        $nomorAdmin = '6289643144013'; 

        $text  = "📢 *ORDER BARU MASUK #{$reservasi->id}*\n";
        $text .= "──────────────────\n";
        $text .= "👤 *Pemesan:* " . $user->name . "\n";
        $text .= "🏟 *Lapangan:* " . $lapangan->nama . "\n";
        $text .= "📅 *Main:* " . $start->translatedFormat('d F Y') . "\n";
        $text .= "⏰ *Jam:* " . $start->format('H:i') . " - " . $end->format('H:i') . "\n";
        $text .= "💰 *Total:* Rp " . number_format($totalPrice, 0, ',', '.') . "\n";
        $text .= "──────────────────\n\n";
        $text .= "Admin, silakan klik link di bawah untuk konfirmasi:\n\n";
        $text .= "✅  *TERIMA PESANAN*\n" . $approveUrl . "\n\n";
        $text .= "❌  *TOLAK PESANAN*\n" . $rejectUrl . "\n\n";
        $text .= "⚠️ _Link ini otomatis mengubah status di sistem._";

        $whatsappUrl = "https://wa.me/{$nomorAdmin}?text=" . urlencode($text);

        return Inertia::location($whatsappUrl);
    }

    // --- AKSI ADMIN ---

    public function approve(Reservasi $reservasi)
    {
        if (!Auth::check() || !Auth::user()->is_admin) {
            return redirect()->route('login')->with('status', 'Silakan login sebagai Admin untuk memproses.');
        }

        // (Opsional) Cek lagi di sini apakah jadwal masih kosong sebelum approve
        // untuk menghindari balapan (race condition) jika admin telat klik
        $isBooked = Reservasi::where('lapangan_id', $reservasi->lapangan_id)
            ->where('status', ReservasiStatus::Confirmed)
            ->where('id', '!=', $reservasi->id) // Jangan cek diri sendiri
            ->where(function ($query) use ($reservasi) {
                $query->where('start_time', '<', $reservasi->end_time)
                      ->where('end_time', '>', $reservasi->start_time);
            })
            ->exists();

        if ($isBooked) {
            return redirect()->route('admin.reservasi.index')
                ->with('error', 'Gagal Terima! Sudah ada jadwal lain yang Confirmed di jam ini.');
        }

        $reservasi->update(['status' => ReservasiStatus::Confirmed]);

        return redirect()->route('admin.reservasi.index')
            ->with('success', "Mantap! Reservasi #{$reservasi->id} sudah disetujui. ✅");
    }

    public function reject(Request $request, Reservasi $reservasi)
    {
        if (!Auth::check() || !Auth::user()->is_admin) {
            return redirect()->route('login')->with('status', 'Silakan login sebagai Admin untuk memproses.');
        }

        // Validasi input alasan dari modal
        $request->validate([
            'reason' => 'nullable|string|max:255'
        ]);

        $reservasi->update([
            'status' => ReservasiStatus::Cancelled,
            'note'   => $request->input('reason') ?? 'Ditolak Admin'
        ]);

        return redirect()->route('admin.reservasi.index')
            ->with('success', "Oke, Reservasi #{$reservasi->id} telah ditolak. ❌");
    }

    public function show(Reservasi $reservasi)
    {
        return Inertia::render('reservasi/show', [ 
            'reservasi' => $reservasi, 
        ]);
    }

   /**
     * Show the form for editing the specified resource.
     */
    public function edit() // Hapus parameter ($reservasi)
    {
        // Kosong karena belum ada fitur edit
    }

    /**
     * Update the specified resource in storage.
     */
    public function update() // Hapus parameter ($request, $reservasi)
    {
        // Kosong karena belum ada fitur update
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy() // Hapus parameter ($reservasi)
    {
        // Kosong karena belum ada fitur delete
    }
}

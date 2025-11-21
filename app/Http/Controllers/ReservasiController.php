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
        // 1. Ambil data dengan relasi 'user' dan 'lapangan'
        // 2. Gunakan get() untuk mengambil koleksi
        // 3. Gunakan map() untuk memformat ulang data (cleaning data)
        $daftarReservasi = Reservasi::with(['user', 'lapangan'])
            ->latest() // Mengurutkan dari yang terbaru
            ->get()
            ->map(function ($reservasi) {
                return [
                    'id' => $reservasi->id,
                    
                    // Mengambil data dari Relasi
                    'user_name' => $reservasi->user->name ?? 'User Terhapus',
                    'lapangan_nama' => $reservasi->lapangan->nama ?? 'Lapangan Terhapus',
                    
                    // FORMAT TANGGAL & WAKTU (Carbon)
                    // Karena sudah di-cast di Model, kita bisa langsung pakai method format()
                    'tanggal_main' => $reservasi->date->format('d M Y'), // Contoh: 21 Nov 2025
                    'jam_mulai'    => $reservasi->start_time->format('H:i'), // Contoh: 14:00
                    'jam_selesai'  => $reservasi->end_time->format('H:i'),   // Contoh: 15:00
                    
                    // Format Rupiah sederhana
                    'total_harga'  => 'Rp ' . number_format($reservasi->total_price, 0, ',', '.'),
                    
                    'status' => $reservasi->status, // Mengirim object Enum
                    'durasi' => $reservasi->duration_hours . ' Jam',
                ];
            });

        return Inertia::render('reservasi/admin/index', [
            'daftarReservasi' => $daftarReservasi
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {   
        return Inertia::render('reservasi/create');
    }


    /**
     * Show the form for creating a new resource.
     */
    public function createFromLapangan(Lapangan $lapangan)
    {   
        return Inertia::render('reservasi/create-from-lapangan', [
            'lapangan' => $lapangan
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservasiRequest $request)
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeFromLapangan(StoreReservasiRequest $request, Lapangan $lapangan, WhatsAppService $waService)
    {
        // Ambil data yang sudah divalidasi
        $date       = $request->validated('date');        // string: "2025-08-15"
        $startTime  = $request->validated('start_time');  // string: "08:00"
        $endTime    = $request->validated('end_time');    // string: "10:00"

        // Gabungkan tanggal + jam → jadikan Carbon instance
        $start = Carbon::createFromFormat('Y-m-d H:i', "$date $startTime");
        $end   = Carbon::createFromFormat('Y-m-d H:i', "$date $endTime");

        // Hitung durasi & total harga
        $durationHours = $start->diffInHours($end);
        $totalPrice    = $durationHours * $lapangan->biaya_per_jam;

        // Simpan reservasi
        Reservasi::create([
            'lapangan_id'     => $lapangan->id,
            'user_id'         => Auth::id(),
            'date'            => $date,
            'start_time'      => $start,           // otomatis jadi datetime
            'end_time'        => $end,             // otomatis jadi datetime
            'duration_hours'  => $durationHours,
            'total_price'     => $totalPrice,
            'status'          => ReservasiStatus::Pending,
        ]);

        $pesan = "Reservasi Baru Masuk";

        $waService->sendMessage('6289643144013', $pesan);

        return redirect()
            ->route('home')
            ->with('success', 'Reservasi berhasil diajukan! Silakan lakukan pembayaran.');
    }

    public function formatNomor($nomor) {
        if (substr($nomor, 0, 1) == '0') {
            return '62' . substr($nomor, 1);
        }
        return $nomor;
    }
    
    /**
     * Display the specified resource.
     */
    public function show(Reservasi $reservasi)
    {
        return Inertia::render('reservasi/show', [ 
            // Data Lapangan dikirim sebagai 'reservasi'
            'reservasi' => $reservasi, 
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservasi $reservasi)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservasiRequest $request, Reservasi $reservasi)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservasi $reservasi)
    {
        //
    }
}

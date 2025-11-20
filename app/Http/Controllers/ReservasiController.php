<?php

namespace App\Http\Controllers;

use App\Enums\ReservasiStatus;
use App\Models\Reservasi;
use App\Http\Requests\StoreReservasiRequest;
use App\Http\Requests\UpdateReservasiRequest;
use App\Models\Lapangan;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
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

    public function indexUser()
    {
    }

    public function indexAdmin()
    {
        return Inertia::render('pengajuan-reservasi/index', [
            'reservasi' => Reservasi::with(['lapangan', 'user'])->latest()->paginate(20)
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
    public function storeFromLapangan(StoreReservasiRequest $request, Lapangan $lapangan)
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

        return redirect()
            ->route('home')
            ->with('success', 'Reservasi berhasil diajukan! Silakan lakukan pembayaran.');
    }
    
    /**
     * Display the specified resource.
     */
    public function show(Reservasi $reservasi)
    {
        //
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

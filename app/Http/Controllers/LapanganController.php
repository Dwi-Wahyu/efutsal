<?php

namespace App\Http\Controllers;

use App\Models\Lapangan;
use App\Http\Requests\StoreLapanganRequest;
use App\Http\Requests\UpdateLapanganRequest;
use Inertia\Inertia;

class LapanganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $daftarLapangan = Lapangan::all();

        return Inertia::render('data-lapangan/index', [
            // Data dikirim ke React sebagai props
            'daftarLapangan' => $daftarLapangan,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('data-lapangan/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLapanganRequest $request)
    {
        // Validasi sudah dilakukan oleh StoreLapanganRequest.
        // Dapatkan data yang sudah divalidasi
        $validated = $request->validated();
        
        // Simpan Gambar (Jika ada)
        if ($request->hasFile('gambar')) {
            // Simpan gambar ke storage dan dapatkan path-nya
            $path = $request->file('gambar')->store('public/lapangan_images');
            // Simpan path gambar ke dalam array data yang akan disimpan
            $validated['gambar'] = str_replace('public/', '', $path); 
        }
        
        // Simpan data ke Database
        Lapangan::create($validated);

        // Redirect ke halaman daftar (index)
        return redirect()->route('lapangan.index')
            ->with('success', 'Lapangan berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Lapangan $lapangan)
    {
        return Inertia::render('data-lapangan/show', [ 
            // Data Lapangan dikirim sebagai 'lapangan'
            'lapangan' => $lapangan, 
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lapangan $lapangan)
    {
        return Inertia::render('data-lapangan/edit', [ 
            // Data Lapangan dikirim sebagai 'lapangan'
            'lapangan' => $lapangan, 
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLapanganRequest $request, Lapangan $lapangan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lapangan $lapangan)
    {
        //
    }
}

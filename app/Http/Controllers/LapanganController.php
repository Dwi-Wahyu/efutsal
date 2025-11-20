<?php

namespace App\Http\Controllers;

use App\Models\Lapangan;
use App\Http\Requests\StoreLapanganRequest;
use App\Http\Requests\UpdateLapanganRequest;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LapanganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $daftarLapangan = Lapangan::all();

        return Inertia::render('lapangan/index', [
            // Data dikirim ke React sebagai props
            'daftarLapangan' => $daftarLapangan,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('lapangan/create');
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
            // Simpan gambar ke subfolder 'lapangan_images' menggunakan DISK 'public'.
            // Path yang dikembalikan akan berbentuk: lapangan_images/namafileunik.jpg
            $path = $request->file('gambar')->store('lapangan_images', 'public');
            
            // Simpan path gambar ke dalam array data yang akan disimpan
            $validated['gambar'] = $path; 
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
        return Inertia::render('lapangan/show', [ 
            // Data Lapangan dikirim sebagai 'lapangan'
            'lapangan' => $lapangan, 
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lapangan $lapangan)
    {
        return Inertia::render('lapangan/edit', [ 
            // Data Lapangan dikirim sebagai 'lapangan'
            'lapangan' => $lapangan, 
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLapanganRequest $request, Lapangan $lapangan)
    {
        // Validasi sudah dilakukan oleh UpdateLapanganRequest.
        // Dapatkan data yang sudah divalidasi
        $validated = $request->validated();

        
        // Simpan Gambar (Jika ada)
        if ($request->hasFile('gambar')) {
            // Menghapus jika ada gambar lama 
            if ($lapangan->gambar) { 
                Storage::disk('public')->delete($lapangan->gambar);
            }

            // Simpan gambar ke subfolder 'lapangan_images' menggunakan DISK 'public'.
            // Path yang dikembalikan akan berbentuk: lapangan_images/namafileunik.jpg
            $path = $request->file('gambar')->store('lapangan_images', 'public');
            
            // Simpan path gambar ke dalam array data yang akan disimpan
            $validated['gambar'] = $path; 
        } else {
            unset($validated['gambar']);
        }
                
        // Simpan data ke Database
        $lapangan->update($validated);

        // Redirect ke halaman daftar (index)
        return redirect()->route('lapangan.index')
            ->with('success', 'Lapangan berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lapangan $lapangan)
    {
        //
    }
}

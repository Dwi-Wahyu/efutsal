<?php

use App\Http\Controllers\LapanganController;
use App\Http\Controllers\ReservasiController;
use App\Http\Controllers\UserController;
use App\Models\Lapangan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'daftarLapangan' => Lapangan::take(6)->get(),
    ]);
})->name('welcome');

Route::get('/cari-lapangan', function () {
    return Inertia::render('cari-lapangan', [
        'daftarLapangan' => Lapangan::all(),
    ]);
})->name('cari-lapangan');


// ========================================================
// 🔥 SHORTLINK UNTUK WA ADMIN (APPROVE / REJECT)
// ========================================================
Route::get('/a/{id}', function ($id) {
    return redirect()->route('admin.reservasi.approve', $id);
});

Route::get('/r/{id}', function ($id) {
    return redirect()->route('admin.reservasi.reject', $id);
});
// ========================================================


Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('home', [UserController::class, 'home'])->name('home');

    Route::resource('lapangan', LapanganController::class);

    Route::resource('reservasi', ReservasiController::class);

    Route::prefix('admin/reservasi')->name('admin_reservasi_')->group(function () {
        Route::get('/', [ReservasiController::class, 'indexAdmin'])->name('index');
    });

    Route::get('lapangan/{lapangan}/reservasi', [ReservasiController::class, 'createFromLapangan'])
        ->name('reservasi.create-from-lapangan');

    Route::post('lapangan/{lapangan}/reservasi', [ReservasiController::class, 'storeFromLapangan'])
        ->name('reservasi.store-from-lapangan');


    Route::prefix('admin/reservasi')->name('admin.reservasi.')->group(function () {

        Route::get('/', [ReservasiController::class, 'indexAdmin'])->name('index');

        // APPROVE
        Route::post('{reservasi}/approve', [ReservasiController::class, 'approve'])
            ->name('approve');

        // REJECT (POST agar bisa kirim alasan)
        Route::post('{reservasi}/reject', [ReservasiController::class, 'reject'])
            ->name('reject');
    });


    Route::get('pengajuan-reservasi', function () {
        return Inertia::render('pengajuan-reservasi');
    })->name('pengajuan-reservasi');
});

require __DIR__.'/settings.php';

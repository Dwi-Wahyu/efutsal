<?php

use App\Http\Controllers\LapanganController;
use App\Http\Controllers\ReservasiController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('welcome');

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

    Route::get('lapangan/{lapangan}/reservasi',[ReservasiController::class, 'createFromLapangan'])
     ->name('reservasi.create-from-lapangan');

    Route::post('lapangan/{lapangan}/reservasi', [ReservasiController::class, 'storeFromLapangan'])
     ->name('reservasi.store-from-lapangan');

    // Route::prefix('data-lapangan')->name('lapangan.')->group(function () {
    //     Route::get('/', [LapanganController::class, 'index'])->name('index'); 
    //     Route::get('/create', [LapanganController::class, 'create'])->name('create');
    //     Route::get('{lapangan}', [LapanganController::class, 'show'])->name('show');    
    //     Route::get('{lapangan}/edit', [LapanganController::class, 'edit'])->name('edit');    
    //     Route::post('/', [LapanganController::class, 'store'])->name('store'); 
    //     Route::put('{lapangan}', [LapanganController::class, 'update'])->name('update'); 
    // });

    Route::get('pengajuan-reservasi', function () {
        return Inertia::render('pengajuan-reservasi');
    })->name('pengajuan-reservasi');
});

require __DIR__.'/settings.php';

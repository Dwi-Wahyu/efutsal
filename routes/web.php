<?php

use App\Http\Controllers\LapanganController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('data-lapangan')->name('lapangan.')->group(function () {
        Route::get('/', [LapanganController::class, 'index'])->name('index'); 
        Route::get('/create', [LapanganController::class, 'create'])->name('create');
        Route::get('{lapangan}', [LapanganController::class, 'show'])->name('show');    
        Route::get('{lapangan}/edit', [LapanganController::class, 'edit'])->name('edit');    
        Route::post('/', [LapanganController::class, 'store'])->name('store'); 
    });

    Route::get('pengajuan-reservasi', function () {
        return Inertia::render('pengajuan-reservasi');
    })->name('pengajuan-reservasi');
});

require __DIR__.'/settings.php';

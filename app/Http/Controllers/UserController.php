<?php

namespace App\Http\Controllers;

use App\Models\Lapangan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $daftarUser = User::all();

        return Inertia::render('data-lapangan/index', [
            // Data dikirim ke React sebagai props
            'daftarUser' => $daftarUser,
        ]);
    }

    public function home()
    {
        $daftarLapangan = Lapangan::all();

        return Inertia::render('home', [
            // Data dikirim ke React sebagai props
            'daftarLapangan' => $daftarLapangan,
        ]);
    }    
}

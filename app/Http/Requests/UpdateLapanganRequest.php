<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLapanganRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna diizinkan untuk membuat request ini.
     */
    public function authorize(): bool
    {
        // Tetap pastikan user terautentikasi dan admin
        return $this->user() && $this->user()->is_admin;
    }

    /**
     * Dapatkan aturan validasi yang berlaku untuk request.
     */
    public function rules(): array
    {
        // Asumsi Route Model Binding digunakan, sehingga 'lapangan' tersedia di request
        // jika Anda memiliki route seperti: Route::put('lapangan/{lapangan}', ...);
        $lapanganId = $this->route('lapangan'); 

        return [
            // Nama: Required, String, Max 100
            // PENTING: Unique, tetapi kecualikan ID lapangan yang sedang diedit
            'nama' => [
                'required', 
                'string', 
                'max:100',
                Rule::unique('lapangan')->ignore($lapanganId),
            ],
            
            // Gambar: Opsional (nullable), jika ada, harus file, format, dan max 4MB
            // PENTING: TIDAK BOLEH 'required'
            'gambar' => ['nullable', 'file', 'mimes:jpeg,png,jpg', 'max:4048'], 
            
            'kapasitas' => ['required', 'integer', 'min:1'],
            'biaya_per_jam' => ['required', 'integer', 'min:10000'],
        ];
    }
}
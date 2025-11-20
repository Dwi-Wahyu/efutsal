<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLapanganRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        if (!$this->user()) {
            return false;
        }

        return $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // --- ATURAN VALIDASI UNTUK SEMUA KOLOM WAJIB ---
            'nama' => ['required', 'string', 'max:100'],
            'kapasitas' => ['required', 'integer', 'min:1'],
            'biaya_per_jam' => ['required', 'integer', 'min:10000'],
            
            // Untuk file upload, gunakan 'file' dan tentukan format/ukuran
            'gambar' => ['required', 'file', 'mimes:jpeg,png,jpg', 'max:4048'], // Maks 4MB       
            // ------------------------------------------------
        ];
    }
}

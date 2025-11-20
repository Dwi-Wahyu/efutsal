<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservasiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'date'        => 'required|date|after_or_equal:today',
            'start_time'  => 'required|date_format:H:i',
            'end_time'    => 'required|date_format:H:i|after:start_time',
        ];
    }

    /**
     * Custom message (opsional, biar lebih ramah)
     */
    public function messages(): array
    {
        return [
            'date.required'          => 'Tanggal wajib diisi.',
            'date.after_or_equal'    => 'Tanggal tidak boleh hari kemarin.',
            'start_time.required'    => 'Jam mulai wajib diisi.',
            'end_time.required'      => 'Jam selesai wajib diisi.',
            'end_time.after'         => 'Jam selesai harus lebih lambat dari jam mulai.',
        ];
    }

    /**
     * Prepare data sebelum validasi (opsional)
     */
    protected function prepareForValidation()
    {
        // Gabung date + time jadi full datetime supaya lebih gampang di controller
        if ($this->date && $this->start_time) {
            $this->merge([
                'start_datetime' => $this->date . ' ' . $this->start_time,
                'end_datetime'   => $this->date . ' ' . $this->end_time,
            ]);
        }
    }
}

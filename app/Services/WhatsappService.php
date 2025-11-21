<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $token;
    protected $phoneId;
    protected $version;

    public function __construct()
    {
        $this->token = env('META_WHATSAPP_TOKEN');
        $this->phoneId = env('META_PHONE_ID');
        $this->version = env('META_VERSION', 'v19.0');
    }

    public function sendMessage($to, $message)
    {
        $url = "https://graph.facebook.com/{$this->version}/{$this->phoneId}/messages";

        try {
            $response = Http::withToken($this->token)
                ->post($url, [
                    'messaging_product' => 'whatsapp',
                    'to' => $to, // Format: 62812xxxx (tanpa + atau 0 di depan)
                    'type' => 'template',
                    'template' => [
                        'body' => $message
                    ]
                ]);

            if ($response->failed()) {
                // Log error jika gagal kirim untuk debugging
                Log::error('WhatsApp Error: ' . $response->body());
                return false;
            }

            return true;

        } catch (\Exception $e) {
            Log::error('WhatsApp Exception: ' . $e->getMessage());
            return false;
        }
    }
}
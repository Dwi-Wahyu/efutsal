<?php

namespace App\Policies;

use App\Models\Reservasi;
use App\Models\User;
use App\Enums\ReservasiStatus;
use Illuminate\Auth\Access\Response;

class ReservasiPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // semua user bisa lihat daftar reservasi
    }

    public function view(User $user, Reservasi $reservasi): bool
    {
        return $user->id === $reservasi->user_id || $user->is_admin;
    }

    public function create(User $user): bool
    {
        return true; // semua user yang login boleh buat reservasi
    }

    public function update(User $user, Reservasi $reservasi): bool
    {
        if ($user->is_admin) {
            return true;
        }

        return $user->id === $reservasi->user_id 
            && $reservasi->status === ReservasiStatus::Pending;
    }

    public function delete(User $user, Reservasi $reservasi): bool
    {
        if ($user->is_admin) {
            return true;
        }

        return $user->id === $reservasi->user_id 
            && $reservasi->status === ReservasiStatus::Pending;
    }

    public function restore(User $user, Reservasi $reservasi): bool
    {
        return $user->is_admin;
    }

    public function forceDelete(User $user, Reservasi $reservasi): bool
    {
        return $user->is_admin;
    }
}
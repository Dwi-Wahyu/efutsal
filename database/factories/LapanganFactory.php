<?php

namespace Database\Factories;

use App\Models\Lapangan;
use Illuminate\Database\Eloquent\Factories\Factory;

class LapanganFactory extends Factory
{
    /**
     * Tentukan model yang terkait dengan factory.
     * @var string
     */
    protected $model = Lapangan::class;

    /**
     * Definisikan data default model.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => $this->faker->unique()->randomElement(['Futsal A', 'Futsal B', 'Futsal C']) . ' - ' . $this->faker->city(),
            'gambar' => $this->faker->imageUrl(640, 480, 'lapangan', true), // URL gambar palsu
            'kapasitas' => $this->faker->numberBetween(10, 50), // Kapasitas antara 10 hingga 50
            'biaya_per_jam' => $this->faker->numberBetween(50000, 250000), // Biaya antara 50.000 hingga 250.000
        ];
    }
}
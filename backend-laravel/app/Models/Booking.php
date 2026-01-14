<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'driver_id', 'type', 'pickup_address', 'destination_address', 'status', 'fare', 'pickup_location', 'destination_location', 'distance_km', 'estimated_time_min'
    ];

    protected $casts = [
        'pickup_location' => 'array',
        'destination_location' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}

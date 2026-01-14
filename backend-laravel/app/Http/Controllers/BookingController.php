<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Booking;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $bookings = $user->bookings()->with('driver')->latest()->get();

        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'type' => ['required', 'in:voyage,colis'],
            'pickup_address' => ['required', 'string'],
            'destination_address' => ['required', 'string'],
            'pickup_location' => ['required', 'array'],
            'pickup_location.lat' => ['required', 'numeric'],
            'pickup_location.lng' => ['required', 'numeric'],
            'destination_location' => ['required', 'array'],
            'destination_location.lat' => ['required', 'numeric'],
            'destination_location.lng' => ['required', 'numeric'],
            'distance_km' => ['nullable', 'numeric'],
            'estimated_time_min' => ['nullable', 'integer'],
        ]);

        $booking = Booking::create([
            'user_id' => $user->id,
            'type' => $data['type'],
            'pickup_address' => $data['pickup_address'],
            'destination_address' => $data['destination_address'],
            'pickup_location' => $data['pickup_location'],
            'destination_location' => $data['destination_location'],
            'distance_km' => $data['distance_km'] ?? null,
            'estimated_time_min' => $data['estimated_time_min'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json($booking, 201);
    }

    public function show(Request $request, $id)
    {
        $user = Auth::user();

        $booking = Booking::with(['driver', 'user'])->find($id);

        if (!$booking) {
            return response()->json(['message' => 'Not found'], 404);
        }

        // Ensure the requesting user owns the booking or is the driver
        if ($booking->user_id !== $user->id && $booking->driver_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($booking);
    }
}

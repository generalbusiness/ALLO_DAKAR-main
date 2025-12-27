// User types
export type UserType = 'client' | 'driver';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: UserType;
}

// Booking types
export interface VoyageBooking {
    id: string;
    departure: string;
    arrival: string;
    date: string;
    time: string;
    seats: number;
    payment: PaymentMethod;
    status: BookingStatus;
    price?: string;
}

export interface ParcelBooking {
    id: string;
    senderName: string;
    senderPhone: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    parcelDescription: string;
    parcelWeight: number;
    payment: PaymentMethod;
    status: BookingStatus;
    price?: string;
}

// Payment types
export type PaymentMethod = 'wallet' | 'wave' | 'om' | 'yass';

// Booking status
export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

// Ride Request for drivers
export interface RideRequest {
    id: number;
    type: 'voyage' | 'colis';
    from: string;
    to: string;
    price: string;
    customer: string;
    date: string;
    time?: string;
    seats?: number;
    weight?: string;
}

// Earnings data
export interface EarningsData {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
}

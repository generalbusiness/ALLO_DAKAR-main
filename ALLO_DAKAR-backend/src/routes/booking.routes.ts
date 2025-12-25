import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest, requireClient, requireDriver } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const CreateBookingSchema = z.object({
    bookingType: z.enum(['VOYAGE', 'COLIS']),
    pickupLocation: z.string(),
    dropoffLocation: z.string(),
    pickupLat: z.number().optional(),
    pickupLng: z.number().optional(),
    dropoffLat: z.number().optional(),
    dropoffLng: z.number().optional(),
    departureTime: z.string(),
    estimatedDuration: z.number().optional(),
    seats: z.number().optional(),
    recipientName: z.string().optional(),
    recipientPhone: z.string().optional(),
    parcelDescription: z.string().optional(),
    parcelWeight: z.number().optional(),
    estimatedPrice: z.number()
});

// Get all bookings for client/driver
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        if (req.userType === 'CLIENT') {
            const bookings = await prisma.booking.findMany({
                where: { clientId: req.userId },
                include: { driver: { select: { name: true, profileImage: true } } }
            });
            res.json(bookings);
        } else {
            const bookings = await prisma.booking.findMany({
                where: { driverId: req.userId },
                include: { client: { select: { name: true, phone: true } } }
            });
            res.json(bookings);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Create booking (client only)
router.post('/', authenticate, requireClient, async (req: AuthRequest, res) => {
    try {
        const validatedData = CreateBookingSchema.parse(req.body);

        const booking = await prisma.booking.create({
            data: {
                clientId: req.userId!,
                ...validatedData,
                departureTime: new Date(validatedData.departureTime),
                status: 'WAITING'
            }
        });

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Accept booking (driver only)
router.put('/:bookingId/accept', authenticate, requireDriver, async (req: AuthRequest, res) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: req.params.bookingId }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.status !== 'WAITING') {
            return res.status(400).json({ error: 'Booking already accepted' });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: req.params.bookingId },
            data: {
                driverId: req.userId,
                status: 'ACCEPTED',
                acceptedAt: new Date()
            }
        });

        res.json({
            message: 'Booking accepted',
            booking: updatedBooking
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept booking' });
    }
});

// Complete booking
router.put('/:bookingId/complete', authenticate, async (req: AuthRequest, res) => {
    try {
        const { finalPrice } = req.body;

        const booking = await prisma.booking.update({
            where: { id: req.params.bookingId },
            data: {
                status: 'COMPLETED',
                finalPrice,
                completedAt: new Date()
            }
        });

        res.json({
            message: 'Booking completed',
            booking
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to complete booking' });
    }
});

// Cancel booking
router.put('/:bookingId/cancel', authenticate, async (req: AuthRequest, res) => {
    try {
        const booking = await prisma.booking.update({
            where: { id: req.params.bookingId },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date()
            }
        });

        res.json({
            message: 'Booking cancelled',
            booking
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// Get booking details
router.get('/:bookingId', authenticate, async (req: AuthRequest, res) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: req.params.bookingId },
            include: {
                client: { select: { id: true, name: true, phone: true, profileImage: true } },
                driver: { select: { id: true, name: true, phone: true, profileImage: true } }
            }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

export default router;

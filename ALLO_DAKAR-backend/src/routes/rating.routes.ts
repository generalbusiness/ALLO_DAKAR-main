import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schema
const RatingSchema = z.object({
    ratedUserId: z.string(),
    bookingId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
});

// Create rating
router.post('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const validatedData = RatingSchema.parse(req.body);

        // Check if booking exists and belongs to user
        const booking = await prisma.booking.findUnique({
            where: { id: validatedData.bookingId }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Verify user is part of the booking
        if (booking.clientId !== req.userId && booking.driverId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const rating = await prisma.rating.create({
            data: {
                raterId: req.userId!,
                ratedId: validatedData.ratedUserId,
                bookingId: validatedData.bookingId,
                rating: validatedData.rating,
                comment: validatedData.comment
            }
        });

        // Update user's average rating
        const userRatings = await prisma.rating.findMany({
            where: { ratedId: validatedData.ratedUserId }
        });

        const avgRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;

        await prisma.user.update({
            where: { id: validatedData.ratedUserId },
            data: { driverRatings: avgRating }
        });

        res.status(201).json({
            message: 'Rating created successfully',
            rating
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to create rating' });
    }
});

// Get ratings for user
router.get('/user/:userId', async (req: Request, res) => {
    try {
        const ratings = await prisma.rating.findMany({
            where: { ratedId: req.params.userId },
            include: {
                rater: { select: { name: true, profileImage: true } }
            }
        });

        const avgRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 5;

        res.json({
            userId: req.params.userId,
            averageRating: avgRating,
            totalRatings: ratings.length,
            ratings
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
});

// Get my ratings (authenticated)
router.get('/my-ratings', authenticate, async (req: AuthRequest, res) => {
    try {
        const myRatings = await prisma.rating.findMany({
            where: { raterId: req.userId },
            include: {
                rated: { select: { name: true, profileImage: true } }
            }
        });

        res.json(myRatings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch your ratings' });
    }
});

export default router;

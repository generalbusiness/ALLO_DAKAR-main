import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest, requireDriver } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        vehicleInfo: true,
        documents: true,
        wallet: true,
        clientBookings: true,
        driverRides: true,
        ratings: true,
        ratingsReceived: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, email, profileImage } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(profileImage && { profileImage })
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add vehicle info (driver only)
router.post('/vehicle', authenticate, requireDriver, async (req: AuthRequest, res) => {
  try {
    const { licensePlate, brand, model, color, seats, insuranceExpiry, registrationExpiry } = req.body;

    const vehicleInfo = await prisma.vehicleInfo.upsert({
      where: { userId: req.userId! },
      update: {
        licensePlate,
        brand,
        model,
        color,
        seats,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        registrationExpiry: registrationExpiry ? new Date(registrationExpiry) : null
      },
      create: {
        userId: req.userId!,
        licensePlate,
        brand,
        model,
        color,
        seats,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        registrationExpiry: registrationExpiry ? new Date(registrationExpiry) : null
      }
    });

    res.json({
      message: 'Vehicle info updated successfully',
      vehicleInfo
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update vehicle info' });
  }
});

// Get driver by ID (for client to see driver info)
router.get('/driver/:driverId', async (req, res) => {
  try {
    const driver = await prisma.user.findUnique({
      where: { id: req.params.driverId },
      select: {
        id: true,
        name: true,
        profileImage: true,
        driverRatings: true,
        vehicleInfo: true
      }
    });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver info' });
  }
});

// Get available drivers for a route
router.get('/drivers/available', async (req, res) => {
  try {
    const { seats } = req.query;

    const drivers = await prisma.user.findMany({
      where: {
        type: 'DRIVER',
        vehicleInfo: {
          seats: {
            gte: seats ? parseInt(seats as string) : 1
          }
        }
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        driverRatings: true,
        vehicleInfo: true
      },
      take: 10
    });

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

export default router;

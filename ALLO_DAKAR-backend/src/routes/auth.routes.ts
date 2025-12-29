import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const RegisterSchema = z.object({
    phone: z.string().regex(/^\d{9,}$/),
    name: z.string().min(2),
    email: z.string().email().optional(),
    password: z.string().min(6),
    type: z.enum(['CLIENT', 'DRIVER'])
});

const LoginSchema = z.object({
    phone: z.string(),
    password: z.string()
});

// Register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const validatedData = RegisterSchema.parse(req.body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { phone: validatedData.phone }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                phone: validatedData.phone,
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                type: validatedData.type,
                wallet: {
                    create: {
                        balance: 0
                    }
                }
            },
            include: { wallet: true }
        });

        // Generate token
        const token = jwt.sign(
            { userId: user.id, userType: user.type },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                type: user.type
            }
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        // handle Prisma unique constraint errors with a useful message
        if (error && error.code === 'P2002' && error.meta && error.meta.target) {
            const fields = Array.isArray(error.meta.target) ? error.meta.target.join(', ') : String(error.meta.target);
            console.error('Registration unique constraint failed:', fields, error);
            return res.status(400).json({ error: `Duplicate value for field(s): ${fields}` });
        }

        // log unexpected errors to help debugging in development
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const validatedData = LoginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { phone: validatedData.phone }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(validatedData.password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, userType: user.type },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                type: user.type
            }
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Test-only cleanup endpoint. Only enabled when backend is started with
// ENABLE_TEST_ROUTES=1 and protected by TEST_SECRET.
router.post('/cleanup', async (req: Request, res: Response) => {
    try {
        const enable = process.env.ENABLE_TEST_ROUTES === '1';
        if (!enable) return res.status(404).json({ error: 'Not found' });

        const secret = process.env.TEST_SECRET || process.env.JWT_SECRET || 'testsecret';
        const { phone, secret: provided } = req.body;
        if (!phone || !provided || provided !== secret) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // delete user and cascade related records if DB schema supports cascades
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) return res.json({ message: 'no-op' });

        await prisma.user.delete({ where: { id: user.id } });
        return res.json({ message: 'deleted', id: user.id });
    } catch (error: any) {
        console.error('Test cleanup error:', error);
        return res.status(500).json({ error: 'cleanup failed' });
    }
});

export default router;

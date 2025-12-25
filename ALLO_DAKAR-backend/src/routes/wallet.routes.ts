import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Get wallet balance
router.get('/balance', authenticate, async (req: AuthRequest, res) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.userId }
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({
      balance: wallet.balance,
      hasPinCode: !!wallet.pinCode
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

// Set PIN code
router.post('/set-pin', authenticate, async (req: AuthRequest, res) => {
  try {
    const { pinCode } = req.body;

    if (!pinCode || pinCode.length !== 4 || !/^\d+$/.test(pinCode)) {
      return res.status(400).json({ error: 'PIN must be 4 digits' });
    }

    const wallet = await prisma.wallet.update({
      where: { userId: req.userId },
      data: { pinCode }
    });

    res.json({
      message: 'PIN code set successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set PIN' });
  }
});

// Verify PIN code
router.post('/verify-pin', authenticate, async (req: AuthRequest, res) => {
  try {
    const { pinCode } = req.body;

    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.userId }
    });

    if (!wallet || wallet.pinCode !== pinCode) {
      return res.status(401).json({ error: 'Invalid PIN code' });
    }

    res.json({
      message: 'PIN verified successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify PIN' });
  }
});

// Deposit funds (will integrate Wave later)
router.post('/deposit', authenticate, async (req: AuthRequest, res) => {
  try {
    const { amount, method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // For now, create transaction as pending
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.userId!,
        type: 'DEPOSIT',
        amount,
        status: 'PENDING',
        description: `Dépôt via ${method || 'unknown'}`
      }
    });

    res.status(201).json({
      message: 'Deposit initiated',
      transaction,
      note: 'Wave integration coming soon'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create deposit' });
  }
});

// Withdraw funds (will integrate Wave later)
router.post('/withdraw', authenticate, async (req: AuthRequest, res) => {
  try {
    const { amount, method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.userId }
    });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.userId!,
        type: 'WITHDRAW',
        amount,
        status: 'PENDING',
        description: `Retrait via ${method || 'unknown'}`
      }
    });

    res.status(201).json({
      message: 'Withdrawal initiated',
      transaction,
      note: 'Wave integration coming soon'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create withdrawal' });
  }
});

// Transfer to another user
router.post('/transfer', authenticate, async (req: AuthRequest, res) => {
  try {
    const { toUserId, amount } = req.body;

    if (!toUserId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid transfer data' });
    }

    // Check recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: toUserId }
    });

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Check sender balance
    const senderWallet = await prisma.wallet.findUnique({
      where: { userId: req.userId }
    });

    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Perform transfer
    await prisma.$transaction([
      prisma.wallet.update({
        where: { userId: req.userId },
        data: { balance: { decrement: amount } }
      }),
      prisma.wallet.update({
        where: { userId: toUserId },
        data: { balance: { increment: amount } }
      }),
      prisma.transaction.create({
        data: {
          userId: req.userId!,
          type: 'TRANSFER_OUT',
          amount,
          status: 'COMPLETED',
          description: `Transfer to ${recipient.name}`,
          toUserId
        }
      }),
      prisma.transaction.create({
        data: {
          userId: toUserId,
          type: 'TRANSFER_IN',
          amount,
          status: 'COMPLETED',
          description: `Transfer from user`,
          fromUserId: req.userId
        }
      })
    ]);

    res.json({
      message: 'Transfer successful'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to transfer funds' });
  }
});

// Get transaction history
router.get('/transactions', authenticate, async (req: AuthRequest, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;

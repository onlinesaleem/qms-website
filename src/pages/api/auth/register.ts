// src/pages/api/auth/register.ts
import bcrypt from 'bcrypt';
import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken } from '@/middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticateToken(req, res, async () => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register user', error });
  }
});
}


import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AdminTokenPayload {
  id: number;
  email: string;
}

export function signAdminToken(payload: AdminTokenPayload) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '2d',
    algorithm: 'HS256'
  });
}

export function verifyAdminToken(
  req: NextRequest
): AdminTokenPayload | null {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not configured');
    return null;
  }

  const header = req.headers.get('authorization');

  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }

  const token = header.slice(7).trim();

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256']
    });

    if (
      typeof decoded === 'string' ||
      typeof decoded.id !== 'number' ||
      !Number.isInteger(decoded.id) ||
      decoded.id <= 0 ||
      typeof decoded.email !== 'string' ||
      !decoded.email.trim()
    ) {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email
    };
  } catch {
    return null;
  }
}

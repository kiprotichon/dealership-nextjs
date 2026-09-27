import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AdminTokenPayload {
  id: number;
  email: string;
}

export function signAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '2d' });
}

export function verifyAdminToken(req: NextRequest): AdminTokenPayload | null {
  const header = req.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as AdminTokenPayload;
  } catch {
    return null;
  }
}

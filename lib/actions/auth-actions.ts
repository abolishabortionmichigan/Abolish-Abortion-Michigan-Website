'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '***REDACTED***';
const ADMIN_ACCESS_CODE = process.env.ADMIN_ACCESS_CODE || 'x9Kp3mW7vR2n';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@abolishabortionmichigan.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Tv8#qL2xZm4!nR9p';

const ADMIN_USERS = [
  {
    id: '1',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: 'Admin',
    role: 'admin',
  },
];

export async function verifyAccessCode(code: string) {
  if (code === ADMIN_ACCESS_CODE) {
    return { valid: true };
  }
  return { valid: false };
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  return token?.value;
}

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 3, // 3 days
    path: '/',
  });
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function loginUser(email: string, password: string) {
  try {
    const user = ADMIN_USERS.find((u) => u.email === email);

    if (!user) {
      return { error: 'Invalid credentials' };
    }

    if (password !== user.password) {
      return { error: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '3d' }
    );

    await setAuthToken(token);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Login failed. Please try again.' };
  }
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    return {
      authorized: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    };
  } catch (error) {
    return { authorized: false, error: 'Invalid token' };
  }
}

export async function logoutUser() {
  await removeAuthToken();
  return { success: true };
}

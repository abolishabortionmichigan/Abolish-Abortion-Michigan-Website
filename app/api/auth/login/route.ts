import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In production, use a database. This is a simple in-memory store for demo.
// You should replace this with Prisma database queries.
const ADMIN_USERS = [
  {
    id: '1',
    email: 'admin@abolishabortionmichigan.com',
    // Password: 'admin123' - Change this in production!
    password: '$2a$10$XYZ123...', // You need to generate a proper hash
    name: 'Admin',
    role: 'admin',
  },
];

const JWT_SECRET = process.env.JWT_SECRET || '***REDACTED***';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user - replace with database query
    const user = ADMIN_USERS.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // For demo purposes, accept any password if using the demo email
    // In production, use: const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidPassword = password === 'admin123' || await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '3d' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { RegisterSchema } from '@/lib/validation/schemas';
import { hashPassword } from '@/lib/auth/password';
import { rateLimit } from '@/lib/middleware/rateLimit';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 registration attempts per 15 minutes
    const rateLimitResponse = rateLimit(request, 3, 15 * 60 * 1000);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();

    // Validate input
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password, username } = validation.data;

    // Check if user already exists
  const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
  const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

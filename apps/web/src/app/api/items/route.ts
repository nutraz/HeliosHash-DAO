import { NextRequest, NextResponse } from 'next/server';

interface Item {
  id: number;
  [key: string]: unknown;
  createdAt: string;
}

// Mock database
const items: Item[] = [];


export async function GET() {
  return NextResponse.json(items);
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newItem = {
      id: Date.now(),
      ...body,
      createdAt: new Date().toISOString()
    };


items.push(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

interface Item {
  id: number;
  [key: string]: unknown;
  createdAt: string;
  updatedAt?: string;
}

let items: Item[] = [];


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);


const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }


items[index] = { ...items[index], ...body, updatedAt: new Date().toISOString() };
    return NextResponse.json(items[index]);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    items = items.filter(item => item.id !== id);


return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}

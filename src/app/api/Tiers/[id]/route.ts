import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tier = await prisma.tier.findUnique({ where: { id } });
    if (!tier) return NextResponse.json({ error: 'Tier not found' }, { status: 404 });
    return NextResponse.json(tier);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tier' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await prisma.tier.update({
      where: { id },
      data: body
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating tier' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.tier.delete({ where: { id } });
    return NextResponse.json({ message: 'Tier deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting tier' }, { status: 500 }); // Likely FK constraint if used
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fy = await prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy) return NextResponse.json({ error: 'Fiscal Year not found' }, { status: 404 });
    return NextResponse.json(fy);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching fiscal year' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await prisma.fiscalYear.update({
      where: { id },
      data: {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating fiscal year' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.fiscalYear.delete({ where: { id } });
    return NextResponse.json({ message: 'Fiscal Year deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting fiscal year' }, { status: 500 });
  }
}

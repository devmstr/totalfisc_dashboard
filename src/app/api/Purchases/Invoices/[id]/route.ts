import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await prisma.purchaseInvoice.findUnique({
      where: { id },
      include: { supplier: true }
    });
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    return NextResponse.json({ ...invoice, items: JSON.parse(invoice.items) });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching purchase invoice' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { items, ...data } = body;
    const updated = await prisma.purchaseInvoice.update({
      where: { id },
      data: {
        ...data,
        date: new Date(data.date),
        dueDate: new Date(data.dueDate),
        items: JSON.stringify(items || []),
      }
    });
    return NextResponse.json({ ...updated, items: JSON.parse(updated.items) });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating purchase invoice' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.purchaseInvoice.delete({ where: { id } });
    return NextResponse.json({ message: 'Purchase Invoice deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting purchase invoice' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const invoices = await prisma.purchaseInvoice.findMany({
      orderBy: { date: 'desc' },
      include: { supplier: true }
    });
    const parsed = invoices.map(inv => ({
        ...inv,
        items: JSON.parse(inv.items)
    }));
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching purchase invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, items, supplier, ...data } = body;
    const invoice = await prisma.purchaseInvoice.create({
      data: {
        ...data,
        date: new Date(data.date),
        dueDate: new Date(data.dueDate),
        items: JSON.stringify(items || []),
      }
    });
    return NextResponse.json({ ...invoice, items: items || [] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating purchase invoice' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const invoices = await prisma.salesInvoice.findMany({
      orderBy: { date: 'desc' },
      include: { client: true }
    });
    // Parse items JSON on read
    const parsed = invoices.map(inv => ({
        ...inv,
        items: JSON.parse(inv.items)
    }));
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching sales invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, items, client, ...data } = body;
    const invoice = await prisma.salesInvoice.create({
      data: {
        ...data,
        date: new Date(data.date),
        dueDate: new Date(data.dueDate),
        items: JSON.stringify(items || []),
        subtotal: data.subtotal || 0,
        taxAmount: data.taxAmount || 0,
        totalAmount: data.totalAmount || 0,
      }
    });
    return NextResponse.json({ ...invoice, items: items || [] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating sales invoice' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTenantId, unauthorizedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const tenantId = getTenantId(request);
    if (!tenantId) return unauthorizedResponse();

    const invoices = await prisma.purchaseInvoice.findMany({
      where: { tenantId },
      orderBy: { date: 'desc' },
      include: { supplier: true }
    });
    const parsed = invoices.map(inv => ({
        ...inv,
        items: JSON.parse(inv.items)
    }));
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error fetching purchase invoices:', error);
    return NextResponse.json({ error: 'Error fetching purchase invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenantId = getTenantId(request);
    if (!tenantId) return unauthorizedResponse();

    const body = await request.json();
    const { id, items, supplier, ...data } = body;
    const invoice = await prisma.purchaseInvoice.create({
      data: {
        ...data,
        tenantId,
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
    console.error('Error creating purchase invoice:', error);
    return NextResponse.json({ error: 'Error creating purchase invoice' }, { status: 500 });
  }
}

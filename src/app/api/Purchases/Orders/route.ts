import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const orders = await prisma.purchaseOrder.findMany({
            orderBy: { date: 'desc' },
            include: { supplier: true }
        });
        const parsed = orders.map(order => ({
            ...order,
            items: JSON.parse(order.items)
        }));
        return NextResponse.json(parsed);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching purchase orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, items, supplier, ...data } = body;
        const order = await prisma.purchaseOrder.create({
            data: {
                ...data,
                date: new Date(data.date),
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
                items: JSON.stringify(items || []),
            }
        });
        return NextResponse.json({ ...order, items: items || [] }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating purchase order' }, { status: 500 });
    }
}

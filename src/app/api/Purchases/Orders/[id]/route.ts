import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const order = await prisma.purchaseOrder.findUnique({
            where: { id },
            include: { supplier: true }
        });
        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        return NextResponse.json({ ...order, items: JSON.parse(order.items) });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching purchase order' }, { status: 500 });
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
        const updated = await prisma.purchaseOrder.update({
            where: { id },
            data: {
                ...data,
                date: new Date(data.date),
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
                items: JSON.stringify(items || []),
            }
        });
        return NextResponse.json({ ...updated, items: JSON.parse(updated.items) });
    } catch (error) {
        return NextResponse.json({ error: 'Error updating purchase order' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.purchaseOrder.delete({ where: { id } });
        return NextResponse.json({ message: 'Purchase Order deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting purchase order' }, { status: 500 });
    }
}

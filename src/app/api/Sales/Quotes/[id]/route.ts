import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const quote = await prisma.salesQuote.findUnique({
            where: { id },
            include: { client: true }
        });
        if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
        return NextResponse.json({ ...quote, items: JSON.parse(quote.items) });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching sales quote' }, { status: 500 });
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
        const updated = await prisma.salesQuote.update({
            where: { id },
            data: {
                ...data,
                date: new Date(data.date),
                expiryDate: new Date(data.expiryDate),
                items: JSON.stringify(items || []),
            }
        });
        return NextResponse.json({ ...updated, items: JSON.parse(updated.items) });
    } catch (error) {
        return NextResponse.json({ error: 'Error updating sales quote' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.salesQuote.delete({ where: { id } });
        return NextResponse.json({ message: 'Sales Quote deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting sales quote' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const quotes = await prisma.salesQuote.findMany({
            orderBy: { date: 'desc' },
            include: { client: true }
        });
        const parsed = quotes.map(quote => ({
            ...quote,
            items: JSON.parse(quote.items)
        }));
        return NextResponse.json(parsed);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching sales quotes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, items, client, ...data } = body;
        const quote = await prisma.salesQuote.create({
            data: {
                ...data,
                date: new Date(data.date),
                expiryDate: new Date(data.expiryDate),
                items: JSON.stringify(items || []),
            }
        });
        return NextResponse.json({ ...quote, items: items || [] }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating sales quote' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fiscalYearId = searchParams.get('fiscalYearId');
    const limit = searchParams.get('limit');
    
    let whereClause = {};
    if (fiscalYearId) {
      whereClause = { fiscalYearId };
    }

    const entries = await prisma.journalEntry.findMany({
      where: whereClause,
      include: { lines: true },
      take: limit ? parseInt(limit) : undefined,
      orderBy: { date: 'desc' } // Or createdAt desc
    });

    const body = entries.map(entry => {
        const totalDebit = entry.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
        const totalCredit = entry.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
        return { ...entry, totalDebit, totalCredit };
    });

    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching journal entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, lines, ...data } = body;
    
    // Create entry with lines
    const entry = await prisma.journalEntry.create({
      data: {
        ...data,
        status: data.status ?? 'draft',
        date: new Date(data.date),
        lines: {
          create: (lines || []).map((line: any) => ({
            accountId: line.accountId,
            thirdPartyId: line.thirdPartyId || null,
            label: line.label,
            debit: line.debit || 0,
            credit: line.credit || 0,
          }))
        }
      },
      include: { lines: true }
    });
    
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating journal entry' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entry = await prisma.journalEntry.findUnique({
      where: { id },
      include: { lines: true }
    });

    if (!entry) return NextResponse.json({ error: 'Journal Entry not found' }, { status: 404 });

    const totalDebit = entry.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = entry.lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    return NextResponse.json({ ...entry, totalDebit, totalCredit });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching journal entry' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { lines, totalDebit, totalCredit, ...data } = body; // Exclude computed fields if present

    // Transaction to replace lines and update entry
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Delete existing lines
      await tx.journalLine.deleteMany({ where: { journalEntryId: id } });

      // 2. Update entry and create new lines
      return await tx.journalEntry.update({
        where: { id },
        data: {
          ...data,
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
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating journal entry' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.journalEntry.delete({ where: { id } });
    return NextResponse.json({ message: 'Journal Entry deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting journal entry' }, { status: 500 });
  }
}

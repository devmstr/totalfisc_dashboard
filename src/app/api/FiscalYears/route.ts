import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const fiscalYears = await prisma.fiscalYear.findMany({
      orderBy: { year: 'desc' }
    });
    return NextResponse.json(fiscalYears);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching fiscal years' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const fy = await prisma.fiscalYear.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status ?? 'Open',
      }
    });
    return NextResponse.json(fy, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating fiscal year' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';
    
    let whereClause = {};
    if (type && type !== 'both') {
      whereClause = {
        OR: [
          { type: type },
          { type: 'both' }
        ]
      };
    }

    const tiers = await prisma.tier.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(tiers);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tiers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const tier = await prisma.tier.create({
      data: data
    });
    return NextResponse.json(tier, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating tier' }, { status: 500 });
  }
}

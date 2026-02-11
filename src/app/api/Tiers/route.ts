import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTenantId, unauthorizedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const tenantId = getTenantId(request);
    if (!tenantId) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';
    
    let whereClause: any = { tenantId };
    if (type && type !== 'both') {
      whereClause.OR = [
        { type: type },
        { type: 'both' }
      ];
    }

    const tiers = await prisma.tier.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(tiers);
  } catch (error) {
    console.error('Error fetching tiers:', error);
    return NextResponse.json({ error: 'Error fetching tiers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenantId = getTenantId(request);
    if (!tenantId) return unauthorizedResponse();

    const body = await request.json();
    const { id, ...data } = body;
    const tier = await prisma.tier.create({
      data: {
        ...data,
        tenantId
      }
    });
    return NextResponse.json(tier, { status: 201 });
  } catch (error) {
    console.error('Error creating tier:', error);
    return NextResponse.json({ error: 'Error creating tier' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTenantId, unauthorizedResponse } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const tenantId = getTenantId(request);
    if (!tenantId) return unauthorizedResponse();

    const accounts = await prisma.account.findMany({
      where: { tenantId }
    });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Error fetching accounts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenantId = getTenantId(request);
    if (!tenantId) return unauthorizedResponse();

    const body = await request.json();
    const { id, ...data } = body;
    const account = await prisma.account.create({
      data: {
        ...data,
        tenantId,
        isSummary: data.isSummary ?? false,
        isAuxiliary: data.isAuxiliary ?? false,
      }
    });
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Error creating account' }, { status: 500 });
  }
}


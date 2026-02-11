import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const accounts = await prisma.account.findMany();
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching accounts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const account = await prisma.account.create({
      data: {
        ...data,
        isSummary: data.isSummary ?? false,
        isAuxiliary: data.isAuxiliary ?? false,
      }
    });
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating account' }, { status: 500 });
  }
}

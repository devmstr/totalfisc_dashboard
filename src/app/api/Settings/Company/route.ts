import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const DEFAULT_ID = 'default';

export async function GET() {
    try {
        let settings = await prisma.companySettings.findUnique({
            where: { id: DEFAULT_ID }
        });

        if (!settings) {
            // Create default settings if not exists
            settings = await prisma.companySettings.create({
                data: {
                    id: DEFAULT_ID,
                    name: 'My Company',
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching company settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        
        const settings = await prisma.companySettings.upsert({
            where: { id: DEFAULT_ID },
            update: data,
            create: {
                ...data,
                id: DEFAULT_ID
            }
        });
        
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Error saving company settings' }, { status: 500 });
    }
}

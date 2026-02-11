import 'dotenv/config'
import prisma from '@/lib/prisma'

async function main() {
  try {
    const fy = await prisma.fiscalYear.findMany()
    console.log('Fiscal Years:', fy)
  } catch (e) {
    console.error('Error:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()

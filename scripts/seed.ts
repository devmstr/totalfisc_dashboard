import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { SCF_ACCOUNTS } from './scf-codes'

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding real data...')

  try {
    // 1. Seed SCF Accounts
    console.log('  -> Seeding accounts from SCF...')
    const accountIds: { [code: string]: string } = {}
    
    for (const acc of SCF_ACCOUNTS) {
      try {
        const account = await prisma.account.create({
          data: {
            accountNumber: acc.code,
            label: acc.label,
            class: acc.class,
            isSummary: false,
            isAuxiliary: false,
          }
        })
        accountIds[acc.code] = account.id
      } catch (e) {
        // Ignore duplicate errors if re-seeding
        console.log(`  ⚠️  Account ${acc.code} might already exist, skipping...`)
      }
    }

    // 2. Get or Create Fiscal Year
    console.log('  -> Seeding Fiscal Year...')
    let fiscalYear = await prisma.fiscalYear.findFirst({
      where: { year: 2026 }
    })

    if (!fiscalYear) {
      fiscalYear = await prisma.fiscalYear.create({
        data: {
          year: 2026,
          startDate: new Date('2026-01-01'),
          endDate: new Date('2026-12-31'),
          status: 'Open'
        }
      })
    }

    // 3. Seed Tiers (Clients & Suppliers)
    console.log('  -> Seeding Tiers...')
    const clientIds: string[] = []
    const supplierIds: string[] = []

    for (let i = 0; i < 10; i++) {
      const isClient = i < 5
      const type = isClient ? 'client' : 'supplier'
      
      const tier = await prisma.tier.create({
        data: {
          name: faker.company.name(),
          type: type,
          taxId: faker.string.numeric(15),
          nis: faker.string.numeric(15),
          tradeReg: faker.string.alphanumeric(10),
          phone: faker.phone.number(),
          email: faker.internet.email(),
          address: faker.location.streetAddress()
        }
      })
      
      if (isClient) clientIds.push(tier.id)
      else supplierIds.push(tier.id)
    }

    // 4. Seed Journal Entries
    console.log('  -> Seeding journal entries...')
    const journalCodes = ['ACH', 'VTE', 'BQ', 'OD']
    
    for (let i = 0; i < 50; i++) {
      const journalCode = faker.helpers.arrayElement(journalCodes)
      let debitAcc = accountIds['600'] // Default Expense
      let creditAcc = accountIds['401'] // Default Supplier

      if (journalCode === 'VTE') {
        debitAcc = accountIds['411'] // Client
        creditAcc = accountIds['700'] // Sales
      } else if (journalCode === 'BQ') {
        debitAcc = accountIds['512'] // Bank
        creditAcc = accountIds['411'] // Client payment
      }

      // If specific accounts missing, fallback to random existing ones
      const allAccIds = Object.values(accountIds)
      if (!debitAcc && allAccIds.length) debitAcc = faker.helpers.arrayElement(allAccIds)
      if (!creditAcc && allAccIds.length) creditAcc = faker.helpers.arrayElement(allAccIds)

      const amount = parseFloat(faker.finance.amount({ min: 1000, max: 100000, dec: 2 }))

      await prisma.journalEntry.create({
        data: {
          fiscalYearId: fiscalYear.id,
          description: faker.finance.transactionDescription(),
          date: faker.date.recent(),
          journalCode: journalCode,
          reference: `REF-${faker.string.alphanumeric(6).toUpperCase()}`,
          status: 'posted',
          lines: {
            create: [
              {
                accountId: debitAcc,
                label: 'Debit',
                debit: amount,
                credit: 0
              },
              {
                accountId: creditAcc,
                label: 'Credit',
                debit: 0,
                credit: amount
              }
            ]
          }
        }
      })
    }

    // 5. Seed Sales Invoices
    console.log('  -> Seeding Sales Invoices...')
    for (let i = 0; i < 20; i++) {
      const client = faker.helpers.arrayElement(clientIds)
      const date = faker.date.recent()
      const dueDate = faker.date.soon({ days: 30 })
      const subtotal = parseFloat(faker.finance.amount({ min: 5000, max: 200000, dec: 2 }))
      const taxAmount = subtotal * 0.19 // 19% TVA
      const totalAmount = subtotal + taxAmount

      await prisma.salesInvoice.create({
        data: {
          clientId: client,
          number: `INV-${faker.string.numeric(5)}`,
          date: date,
          dueDate: dueDate,
          subtotal: subtotal,
          taxAmount: taxAmount,
          totalAmount: totalAmount,
          status: faker.helpers.arrayElement(['draft', 'sent', 'paid', 'overdue']),
          items: JSON.stringify([
            {
              description: faker.commerce.productName(),
              quantity: faker.number.int({ min: 1, max: 10 }),
              unitPrice: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
              total: subtotal
            }
          ])
        }
      })
    }

    // 6. Seed Purchase Invoices
    console.log('  -> Seeding Purchase Invoices...')
    for (let i = 0; i < 20; i++) {
      const supplier = faker.helpers.arrayElement(supplierIds)
      const date = faker.date.recent()
      const dueDate = faker.date.soon({ days: 30 })
      const subtotal = parseFloat(faker.finance.amount({ min: 5000, max: 200000, dec: 2 }))
      const taxAmount = subtotal * 0.19 // 19% TVA
      const totalAmount = subtotal + taxAmount

      await prisma.purchaseInvoice.create({
        data: {
          supplierId: supplier,
          number: `BILL-${faker.string.numeric(5)}`,
          date: date,
          dueDate: dueDate,
          subtotal: subtotal,
          taxAmount: taxAmount,
          totalAmount: totalAmount,
          status: faker.helpers.arrayElement(['draft', 'received', 'paid']),
          items: JSON.stringify([
            {
              description: faker.commerce.productName(),
              quantity: faker.number.int({ min: 1, max: 10 }),
              unitPrice: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
              total: subtotal
            }
          ])
        }
      })
    }
    
    console.log('✅ Seeding complete!')
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message)
    console.error('Full error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

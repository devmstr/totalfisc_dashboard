import { faker } from '@faker-js/faker'
import axios from 'axios'
import { SCF_ACCOUNTS } from './scf-codes'

const API_URL = 'http://localhost:5015/api' // Corrected port from Linux guide

async function seed() {
  console.log('🌱 Seeding real data...')

  try {
    // 1. Seed SCF Accounts
    console.log('  -> Seeding accounts from SCF...')
    const accountIds: { [code: string]: string } = {}
    
    // Clear existing accounts first (optional, but good for clean seed)
    // For now we just append, assuming empty DB on fresh start

    for (const acc of SCF_ACCOUNTS) {
      try {
        const response = await axios.post(`${API_URL}/Accounts`, {
          accountNumber: acc.code,
          label: acc.label,
          class: acc.class,
          isSummary: false,
          isAuxiliary: false,
          // If we had parent logic we'd map it here, but keeping simple for now
        })
        if (response.data?.id) {
          accountIds[acc.code] = response.data.id
        }
      } catch (e) {
        // Ignore duplicate errors if re-seeding
      }
    }

    // 2. Get or Create Fiscal Year
    console.log('  -> Seeding Fiscal Year...')
    let fiscalYearId = ''
    try {
        const fyRes = await axios.post(`${API_URL}/FiscalYears`, {
            yearNumber: 2026,
            startDate: '2026-01-01',
            endDate: '2026-12-31',
            status: 'Open'
        })
        fiscalYearId = fyRes.data.id
    } catch (e) {
        // If exists, likely getting 409 or similar. In this simple backend, we just search or pick one.
        const allFy = await axios.get(`${API_URL}/FiscalYears`)
        if (allFy.data.length > 0) fiscalYearId = allFy.data[0].id
        else fiscalYearId = faker.string.uuid() // Fallback
    }


    // 3. Seed Tiers (Clients & Suppliers)
    console.log('  -> Seeding Tiers...')
    const clientIds: string[] = []
    const supplierIds: string[] = []

    for (let i = 0; i < 10; i++) {
        const isClient = i < 5
        const type = isClient ? 'client' : 'supplier'
        const res = await axios.post(`${API_URL}/Tiers`, {
            code: isClient ? `CLI-${faker.string.numeric(3)}` : `FRN-${faker.string.numeric(3)}`,
            name: faker.company.name(),
            type: type,
            nif: faker.string.numeric(15),
            nis: faker.string.numeric(15),
            rc: faker.string.alphanumeric(10),
            phone: faker.phone.number(),
            email: faker.internet.email(),
            address: faker.location.streetAddress()
        })
        if (isClient) clientIds.push(res.data.id)
        else supplierIds.push(res.data.id)
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

      const amount = parseFloat(faker.finance.amount({ min: 1000, max: 100000, dec: 2 }));

      await axios.post(`${API_URL}/JournalEntries`, {
        fiscalYearId: fiscalYearId,
        description: faker.finance.transactionDescription(),
        date: faker.date.recent().toISOString(),
        journalCode: journalCode,
        reference: `REF-${faker.string.alphanumeric(6).toUpperCase()}`,
        lines: [
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
      })
    }

    // 5. Seed Sales Invoices
    console.log('  -> Seeding Sales Invoices...')
    for (let i = 0; i < 20; i++) {
        const client = faker.helpers.arrayElement(clientIds)
        const date = faker.date.recent().toISOString()
        const dueDate = faker.date.soon({ days: 30 }).toISOString()
        const amount = parseFloat(faker.finance.amount({ min: 5000, max: 200000, dec: 2 }))

        await axios.post(`${API_URL}/Sales/Invoices`, {
            fiscalYearId: fiscalYearId,
            clientId: client,
            number: `INV-${faker.string.numeric(5)}`,
            date: date,
            dueDate: dueDate,
            totalAmount: amount,
            status: faker.helpers.arrayElement(['Draft', 'Sent', 'Paid', 'Overdue'])
        })
    }

    // 6. Seed Purchase Invoices
    console.log('  -> Seeding Purchase Invoices...')
    for (let i = 0; i < 20; i++) {
        const supplier = faker.helpers.arrayElement(supplierIds)
        const date = faker.date.recent().toISOString()
        const dueDate = faker.date.soon({ days: 30 }).toISOString()
        const amount = parseFloat(faker.finance.amount({ min: 5000, max: 200000, dec: 2 }))

        await axios.post(`${API_URL}/Purchases/Invoices`, {
            fiscalYearId: fiscalYearId,
            supplierId: supplier,
            number: `BILL-${faker.string.numeric(5)}`,
            date: date,
            dueDate: dueDate,
            totalAmount: amount,
            status: faker.helpers.arrayElement(['Draft', 'Received', 'Paid'])
        })
    }
    
    console.log('✅ Seeding complete!')
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.response?.data || error.message)
  }
}

seed()

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DB_FILE = path.join(process.cwd(), 'backend', 'db.json');

async function main() {
  console.log('Reading database file from:', DB_FILE);
  if (!fs.existsSync(DB_FILE)) {
    console.error('Database file not found!');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

  // 1. Migrate Accounts
  console.log('Migrating Accounts...');
  for (const account of data.accounts || []) {
    await prisma.account.create({
      data: {
        id: account.id,
        accountNumber: account.accountNumber,
        label: account.label,
        isSummary: account.isSummary || false,
        isAuxiliary: account.isAuxiliary || false,
        class: account.class || undefined,
      }
    });
  }

  // 2. Migrate Fiscal Years
  console.log('Migrating Fiscal Years...');
  for (const fy of data.fiscalYears || []) {
    const startDate = new Date(fy.startDate);
    await prisma.fiscalYear.create({
      data: {
        id: fy.id,
        year: fy.year || startDate.getFullYear(),
        startDate: startDate,
        endDate: new Date(fy.endDate),
        status: fy.status || 'Open',
      }
    });
  }

  // 3. Migrate Tiers
  console.log('Migrating Tiers...');
  for (const tier of data.tiers || []) {
    await prisma.tier.create({
      data: {
        id: tier.id,
        name: tier.name,
        type: tier.type,
        taxId: tier.taxId,
        tradeReg: tier.tradeReg,
        address: tier.address,
        phone: tier.phone,
        email: tier.email,
        website: tier.website,
        notes: tier.notes,
        activity: tier.activity,
        nis: tier.nis,
        art: tier.art,
      }
    });
  }

  // Cache existing IDs for validation
  const accountIds = new Set((data.accounts || []).map((a: any) => a.id));
  const fiscalYearIds = new Set((data.fiscalYears || []).map((fy: any) => fy.id));
  const tierIds = new Set((data.tiers || []).map((t: any) => t.id));

  // 4. Migrate Journal Entries & Lines
  console.log('Migrating Journal Entries...');
  for (const entry of data.journalEntries || []) {
    if (!fiscalYearIds.has(entry.fiscalYearId)) {
        console.warn(`Skipping JournalEntry ${entry.id}: FiscalYear ${entry.fiscalYearId} not found.`);
        continue;
    }
    await prisma.journalEntry.create({
      data: {
        id: entry.id,
        date: new Date(entry.date || entry.entryDate || entry.createdAt),
        journalCode: entry.journalCode,
        reference: entry.reference,
        description: entry.description,
        status: entry.status || 'draft',
        fiscalYearId: entry.fiscalYearId,
        lines: {
          create: (entry.lines || [])
            .filter((line: any) => {
                if (!accountIds.has(line.accountId)) {
                    console.warn(`Skipping JournalLine ${line.id}: Account ${line.accountId} not found.`);
                    return false;
                }
                return true;
            })
            .map((line: any) => ({
            id: line.id, // Ensure ID is preserved if present, or let Prisma generate
            accountId: line.accountId,
            thirdPartyId: tierIds.has(line.thirdPartyId) ? line.thirdPartyId : null,
            label: line.label,
            debit: line.debit || 0,
            credit: line.credit || 0,
          }))
        }
      }
    });
  }

  // 5. Migrate Sales Invoices
  console.log('Migrating Sales Invoices...');
  for (const invoice of data.salesInvoices || []) {
    await prisma.salesInvoice.create({
      data: {
        id: invoice.id,
        number: invoice.number,
        date: new Date(invoice.date),
        dueDate: new Date(invoice.dueDate),
        clientId: invoice.clientId,
        status: invoice.status,
        subtotal: invoice.subtotal || 0,
        taxAmount: invoice.taxAmount || 0,
        totalAmount: invoice.totalAmount || 0,
        notes: invoice.notes,
        items: JSON.stringify(invoice.items || []), // Store items as JSON string for now
      }
    });
  }

  // 6. Migrate Purchase Invoices
  console.log('Migrating Purchase Invoices...');
  for (const invoice of data.purchaseInvoices || []) {
    await prisma.purchaseInvoice.create({
      data: {
        id: invoice.id,
        number: invoice.number,
        date: new Date(invoice.date),
        dueDate: new Date(invoice.dueDate),
        supplierId: invoice.supplierId,
        status: invoice.status,
        subtotal: invoice.subtotal || 0,
        taxAmount: invoice.taxAmount || 0,
        totalAmount: invoice.totalAmount || 0,
        notes: invoice.notes,
        items: JSON.stringify(invoice.items || []),
      }
    });
  }

  // 7. Migrate Sales Quotes
  console.log('Migrating Sales Quotes...');
  for (const quote of data.salesQuotes || []) {
    await prisma.salesQuote.create({
      data: {
        id: quote.id,
        number: quote.number,
        date: new Date(quote.date),
        expiryDate: new Date(quote.expiryDate),
        clientId: quote.clientId,
        status: quote.status,
        subtotal: quote.subtotal || 0,
        taxAmount: quote.taxAmount || 0,
        totalAmount: quote.totalAmount || 0,
        notes: quote.notes,
        items: JSON.stringify(quote.items || []),
      }
    });
  }

  // 8. Migrate Purchase Orders
  console.log('Migrating Purchase Orders...');
  for (const order of data.purchaseOrders || []) {
    await prisma.purchaseOrder.create({
      data: {
        id: order.id,
        number: order.number,
        date: new Date(order.date),
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : null,
        supplierId: order.supplierId,
        status: order.status,
        subtotal: order.subtotal || 0,
        taxAmount: order.taxAmount || 0,
        totalAmount: order.totalAmount || 0,
        notes: order.notes,
        items: JSON.stringify(order.items || []),
      }
    });
  }

  // 9. Migrate Settings
  console.log('Migrating Settings...');
  const settings = data.settings || {};
  if (Object.keys(settings).length > 0) {
    await prisma.companySettings.create({
      data: {
        id: 'default', // Force default ID
        name: settings.name || 'My Company',
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        website: settings.website,
        taxId: settings.taxId,
        tradeReg: settings.tradeReg,
        nis: settings.nis,
        art: settings.art,
        logo: settings.logo,
        currency: settings.currency || 'DZD',
        fiscalYearStartMonth: settings.fiscalYearStartMonth || 1,
      }
    });
  }

  console.log('Migration completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

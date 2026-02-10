const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5015;

app.use(cors());
app.use(bodyParser.json());

const DB_FILE = path.join(__dirname, 'db.json');

// --- Simple JSON File Database ---
function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      accounts: [],
      fiscalYears: [],
      tiers: [],
      journalEntries: [],
      salesInvoices: [],
      purchaseInvoices: [],
      salesQuotes: [],
      purchaseOrders: [],
      settings: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- Helper Functions ---
function getCollection(collectionName) {
  const db = readDb();
  return db[collectionName] || [];
}

function saveCollection(collectionName, items) {
  const db = readDb();
  db[collectionName] = items;
  writeDb(db);
}

// --- Routes ---

// 1. Accounts
app.get('/api/Accounts', (req, res) => {
  res.json(getCollection('accounts'));
});

app.post('/api/Accounts', (req, res) => {
  const accounts = getCollection('accounts');
  const newAccount = { id: uuidv4(), ...req.body };
  accounts.push(newAccount);
  saveCollection('accounts', accounts);
  res.status(201).json(newAccount);
});

app.put('/api/Accounts/:id', (req, res) => {
  const accounts = getCollection('accounts');
  const index = accounts.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    accounts[index] = { ...accounts[index], ...req.body };
    saveCollection('accounts', accounts);
    res.json(accounts[index]);
  } else {
    res.status(404).json({ message: 'Account not found' });
  }
});

app.delete('/api/Accounts/:id', (req, res) => {
  let accounts = getCollection('accounts');
  accounts = accounts.filter(a => a.id !== req.params.id);
  saveCollection('accounts', accounts);
  res.json({ message: 'Account deleted' });
});

// 2. Fiscal Years
app.get('/api/FiscalYears', (req, res) => {
  res.json(getCollection('fiscalYears'));
});

app.post('/api/FiscalYears', (req, res) => {
  const fiscalYears = getCollection('fiscalYears');
  const newFY = { id: uuidv4(), ...req.body };
  fiscalYears.push(newFY);
  saveCollection('fiscalYears', fiscalYears);
  res.status(201).json(newFY);
});

app.put('/api/FiscalYears/:id', (req, res) => {
  const fiscalYears = getCollection('fiscalYears');
  const index = fiscalYears.findIndex(fy => fy.id === req.params.id);
  if (index !== -1) {
    fiscalYears[index] = { ...fiscalYears[index], ...req.body };
    saveCollection('fiscalYears', fiscalYears);
    res.json(fiscalYears[index]);
  } else {
    res.status(404).json({ message: 'Fiscal Year not found' });
  }
});

app.delete('/api/FiscalYears/:id', (req, res) => {
  let fiscalYears = getCollection('fiscalYears');
  fiscalYears = fiscalYears.filter(fy => fy.id !== req.params.id);
  saveCollection('fiscalYears', fiscalYears);
  res.json({ message: 'Fiscal Year deleted' });
});

// 3. Tiers (Clients/Suppliers)
app.get('/api/Tiers', (req, res) => {
  const type = req.query.type;
  let tiers = getCollection('tiers');
  if (type && type !== 'both') {
    tiers = tiers.filter(t => t.type === type || t.type === 'both');
  }
  res.json(tiers);
});

app.post('/api/Tiers', (req, res) => {
  const tiers = getCollection('tiers');
  const newTier = { id: uuidv4(), ...req.body };
  tiers.push(newTier);
  saveCollection('tiers', tiers);
  res.status(201).json(newTier);
});

app.put('/api/Tiers/:id', (req, res) => {
  const tiers = getCollection('tiers');
  const index = tiers.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    tiers[index] = { ...tiers[index], ...req.body };
    saveCollection('tiers', tiers);
    res.json(tiers[index]);
  } else {
    res.status(404).json({ message: 'Tier not found' });
  }
});

app.delete('/api/Tiers/:id', (req, res) => {
  let tiers = getCollection('tiers');
  tiers = tiers.filter(t => t.id !== req.params.id);
  saveCollection('tiers', tiers);
  res.json({ message: 'Tier deleted' });
});

// 4. Journal Entries
app.get('/api/JournalEntries', (req, res) => {
  const { fiscalYearId, limit } = req.query;
  let entries = getCollection('journalEntries');
  
  if (fiscalYearId) {
    entries = entries.filter(e => e.fiscalYearId === fiscalYearId);
  }
  
  // Calculate totals for each entry on the fly if not stored
  entries = entries.map(entry => {
    const totalDebit = entry.lines?.reduce((sum, line) => sum + (line.debit || 0), 0) || 0;
    const totalCredit = entry.lines?.reduce((sum, line) => sum + (line.credit || 0), 0) || 0;
    return { ...entry, totalDebit, totalCredit };
  });

  if (limit) {
    entries = entries.slice(0, parseInt(limit));
  }
  
  res.json(entries);
});

app.get('/api/JournalEntries/:id', (req, res) => {
  const entries = getCollection('journalEntries');
  const entry = entries.find(e => e.id === req.params.id);
  if (entry) {
     res.json(entry);
  } else {
    res.status(404).json({ message: 'Journal Entry not found' });
  }
});


app.post('/api/JournalEntries', (req, res) => {
  const entries = getCollection('journalEntries');
  const newEntry = { 
    id: uuidv4(), 
    createdAt: new Date().toISOString(),
    status: 'draft',
    ...req.body 
  };
  entries.push(newEntry);
  saveCollection('journalEntries', entries);
  res.status(201).json(newEntry);
});

app.put('/api/JournalEntries/:id', (req, res) => {
  const entries = getCollection('journalEntries');
  const index = entries.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...req.body };
    saveCollection('journalEntries', entries);
    res.json(entries[index]);
  } else {
    res.status(404).json({ message: 'Journal Entry not found' });
  }
});

app.delete('/api/JournalEntries/:id', (req, res) => {
  let entries = getCollection('journalEntries');
  entries = entries.filter(e => e.id !== req.params.id);
  saveCollection('journalEntries', entries);
  res.json({ message: 'Journal Entry deleted' });
});

app.post('/api/JournalEntries/:id/post', (req, res) => {
  const entries = getCollection('journalEntries');
  const index = entries.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    entries[index].status = 'posted';
    saveCollection('journalEntries', entries);
    res.json(entries[index]);
  } else {
    res.status(404).json({ message: 'Journal Entry not found' });
  }
});

// 5. Sales Invoices
app.get('/api/Sales/Invoices', (req, res) => {
    res.json(getCollection('salesInvoices'));
});

app.post('/api/Sales/Invoices', (req, res) => {
  const sales = getCollection('salesInvoices');
  const newSale = { id: uuidv4(), ...req.body };
  sales.push(newSale);
  saveCollection('salesInvoices', sales);
  res.status(201).json(newSale);
});

app.put('/api/Sales/Invoices/:id', (req, res) => {
  const sales = getCollection('salesInvoices');
  const index = sales.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    sales[index] = { ...sales[index], ...req.body };
    saveCollection('salesInvoices', sales);
    res.json(sales[index]);
  } else {
    res.status(404).json({ message: 'Invoice not found' });
  }
});

app.delete('/api/Sales/Invoices/:id', (req, res) => {
  let sales = getCollection('salesInvoices');
  sales = sales.filter(s => s.id !== req.params.id);
  saveCollection('salesInvoices', sales);
  res.json({ message: 'Invoice deleted' });
});

// 6. Sales Quotes
app.post('/api/Sales/Quotes', (req, res) => {
    const quotes = getCollection('salesQuotes');
    const newQuote = { id: uuidv4(), ...req.body };
    quotes.push(newQuote);
    saveCollection('salesQuotes', quotes);
    res.status(201).json(newQuote);
});

// 7. Purchase Invoices
app.get('/api/Purchases/Invoices', (req, res) => {
    res.json(getCollection('purchaseInvoices'));
});

app.post('/api/Purchases/Invoices', (req, res) => {
  const purchases = getCollection('purchaseInvoices');
  const newPurchase = { id: uuidv4(), ...req.body };
  purchases.push(newPurchase);
  saveCollection('purchaseInvoices', purchases);
  res.status(201).json(newPurchase);
});

app.put('/api/Purchases/Invoices/:id', (req, res) => {
  const purchases = getCollection('purchaseInvoices');
  const index = purchases.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    purchases[index] = { ...purchases[index], ...req.body };
    saveCollection('purchaseInvoices', purchases);
    res.json(purchases[index]);
  } else {
    res.status(404).json({ message: 'Invoice not found' });
  }
});

app.delete('/api/Purchases/Invoices/:id', (req, res) => {
  let purchases = getCollection('purchaseInvoices');
  purchases = purchases.filter(p => p.id !== req.params.id);
  saveCollection('purchaseInvoices', purchases);
  res.json({ message: 'Invoice deleted' });
});

// 8. Purchase Orders
app.post('/api/Purchases/Orders', (req, res) => {
    const orders = getCollection('purchaseOrders');
    const newOrder = { id: uuidv4(), ...req.body };
    orders.push(newOrder);
    saveCollection('purchaseOrders', orders);
    res.status(201).json(newOrder);
});

// 9. Settings
app.get('/api/Settings/Company', (req, res) => {
    res.json(getCollection('settings'));
});

app.post('/api/Settings/Company', (req, res) => {
    saveCollection('settings', req.body);
    res.json(req.body);
});

// 10. Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

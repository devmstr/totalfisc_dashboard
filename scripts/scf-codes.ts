export const SCF_ACCOUNTS = [
  // Class 1: Equity
  { code: '101', label: 'Capital social', class: 1 },
  { code: '104', label: 'Ecarts d\'évaluation', class: 1 },
  { code: '105', label: 'Ecarts de réévaluation', class: 1 },
  { code: '106', label: 'Réserves', class: 1 },
  { code: '1061', label: 'Réserve légale', class: 1, parentAccountId: '106' },
  { code: '1062', label: 'Réserves statutaires', class: 1, parentAccountId: '106' },
  { code: '110', label: 'Report à nouveau (solde créditeur)', class: 1 },
  { code: '120', label: 'Résultat de l\'exercice (bénéfice)', class: 1 },
  { code: '129', label: 'Résultat de l\'exercice (perte)', class: 1 },
  { code: '164', label: 'Emprunts auprès des établissements de crédit', class: 1 },
  
  // Class 2: Assets
  { code: '204', label: 'Logiciels informatiques et assimilés', class: 2 },
  { code: '211', label: 'Terrains', class: 2 },
  { code: '213', label: 'Constructions', class: 2 },
  { code: '215', label: 'Installations techniques', class: 2 },
  { code: '218', label: 'Autres immobilisations corporelles', class: 2 },
  { code: '281', label: 'Amortissement des immobilisations corporelles', class: 2 },

  // Class 3: Stocks
  { code: '30', label: 'Stocks de marchandises', class: 3 },
  { code: '31', label: 'Matières premières et fournitures', class: 3 },
  { code: '32', label: 'Autres approvisionnements', class: 3 },
  { code: '35', label: 'Stocks de produits', class: 3 },

  // Class 4: Third Parties
  { code: '401', label: 'Fournisseurs de stocks et services', class: 4 },
  { code: '404', label: 'Fournisseurs d\'immobilisations', class: 4 },
  { code: '411', label: 'Clients', class: 4 },
  { code: '416', label: 'Clients douteux ou litigieux', class: 4 },
  { code: '421', label: 'Personnel - Rémunérations dues', class: 4 },
  { code: '431', label: 'Sécurité sociale', class: 4 },
  { code: '444', label: 'Etat - Impôts sur les résultats', class: 4 },
  { code: '445', label: 'Etat - Taxes sur le chiffre d\'affaires', class: 4 },
  { code: '4456', label: 'TVA déductible', class: 4 },
  { code: '4457', label: 'TVA collectée', class: 4 },

  // Class 5: Financial
  { code: '512', label: 'Banques Comptes Courants', class: 5 },
  { code: '531', label: 'Caisse siège social', class: 5 },

  // Class 6: Expenses
  { code: '600', label: 'Achats de marchandises vendues', class: 6 },
  { code: '601', label: 'Matières premières consommées', class: 6 },
  { code: '602', label: 'Autres approvisionnements consommés', class: 6 },
  { code: '613', label: 'Locations', class: 6 },
  { code: '615', label: 'Entretien et réparations', class: 6 },
  { code: '616', label: 'Primes d\'assurances', class: 6 },
  { code: '624', label: 'Transports de biens et personnel', class: 6 },
  { code: '625', label: 'Déplacements, missions et réceptions', class: 6 },
  { code: '626', label: 'Frais postaux et de télécommunications', class: 6 },
  { code: '631', label: 'Rémunérations du personnel', class: 6 },
  { code: '642', label: 'Impôts et taxes non récupérables sur CA', class: 6 },
  { code: '661', label: 'Charges d\'intérêts', class: 6 },
  { code: '681', label: 'Dotations aux amortissements', class: 6 },

  // Class 7: Revenues
  { code: '700', label: 'Ventes de marchandises', class: 7 },
  { code: '701', label: 'Ventes de produits finis', class: 7 },
  { code: '704', label: 'Vente de travaux', class: 7 },
  { code: '706', label: 'Autres prestations de services', class: 7 }
]

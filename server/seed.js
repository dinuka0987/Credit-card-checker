/**
 * Seed script to populate MongoDB with sample compromised card data.
 * Uses standard test card numbers (never real card numbers).
 *
 * Run with: npm run seed
 */
const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

const Card = require('./models/Card');

function hashCardNumber(cardNumber) {
  return crypto.createHash('sha256').update(cardNumber).digest('hex');
}

// Standard test card numbers — these are publicly known test numbers
// used by payment processors and are NOT real cards.
const sampleCards = [
  {
    cardNumber: '4111111111111111',
    last4: '1111',
    cardHolder: 'John Doe',
    expiryMonth: '12',
    expiryYear: '25',
    cardType: 'visa',
    breachSource: 'DarkWeb Forum - CardShop_X',
    breachDate: new Date('2024-06-15'),
    riskLevel: 'critical',
    additionalInfo: 'Found in a major data dump containing 50,000+ cards. Associated with a retail chain breach.'
  },
  {
    cardNumber: '5500000000000004',
    last4: '0004',
    cardHolder: 'Jane Smith',
    expiryMonth: '08',
    expiryYear: '26',
    cardType: 'mastercard',
    breachSource: 'Underground Market - ShadowCards',
    breachDate: new Date('2024-03-22'),
    riskLevel: 'high',
    additionalInfo: 'Listed for sale on a known carding marketplace. Card details include full CVV and billing address.'
  },
  {
    cardNumber: '340000000000009',
    last4: '0009',
    cardHolder: 'Robert Johnson',
    expiryMonth: '03',
    expiryYear: '27',
    cardType: 'amex',
    breachSource: 'Phishing Campaign - FinanceAlert',
    breachDate: new Date('2024-09-10'),
    riskLevel: 'medium',
    additionalInfo: 'Obtained through a sophisticated phishing campaign targeting premium card holders.'
  },
  {
    cardNumber: '4012888888881881',
    last4: '1881',
    cardHolder: 'Alice Williams',
    expiryMonth: '11',
    expiryYear: '25',
    cardType: 'visa',
    breachSource: 'Skimmer Network - POS_Breach_2024',
    breachDate: new Date('2024-01-05'),
    riskLevel: 'critical',
    additionalInfo: 'Captured via a point-of-sale skimmer installed at multiple gas stations across the region.'
  },
  {
    cardNumber: '5105105105105100',
    last4: '5100',
    cardHolder: 'Michael Brown',
    expiryMonth: '07',
    expiryYear: '26',
    cardType: 'mastercard',
    breachSource: 'Data Breach - E-Commerce Platform',
    breachDate: new Date('2024-07-30'),
    riskLevel: 'high',
    additionalInfo: 'Part of a data breach affecting an online retailer. Encrypted data was decrypted by attackers.'
  },
  {
    cardNumber: '6011111111111117',
    last4: '1117',
    cardHolder: 'Sarah Davis',
    expiryMonth: '05',
    expiryYear: '27',
    cardType: 'discover',
    breachSource: 'Malware - BankTrojan_v3',
    breachDate: new Date('2024-11-18'),
    riskLevel: 'critical',
    additionalInfo: 'Extracted by banking trojan malware from infected desktop. Multiple transactions detected.'
  },
  {
    cardNumber: '4222222222222',
    last4: '2222',
    cardHolder: 'David Wilson',
    expiryMonth: '09',
    expiryYear: '25',
    cardType: 'visa',
    breachSource: 'Social Engineering - CallCenter Breach',
    breachDate: new Date('2024-04-12'),
    riskLevel: 'low',
    additionalInfo: 'Obtained through social engineering of a call center employee. Limited data exposure.'
  },
  {
    cardNumber: '5425233430109903',
    last4: '9903',
    cardHolder: 'Emily Taylor',
    expiryMonth: '02',
    expiryYear: '28',
    cardType: 'mastercard',
    breachSource: 'WiFi Interception - PublicHotspot',
    breachDate: new Date('2024-08-25'),
    riskLevel: 'medium',
    additionalInfo: 'Intercepted on an unsecured public WiFi network. Card was used on a non-HTTPS payment page.'
  }
];

async function seedDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/creditcard-checker';

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing cards
    await Card.deleteMany({});
    console.log('🗑️  Cleared existing card records');

    // Insert sample cards with full details (for demo purposes as requested by user)
    const cardsToInsert = sampleCards.map(card => ({
      cardNumberHash: hashCardNumber(card.cardNumber),
      cardNumber: card.cardNumber, // User requested storing full card number
      cvv: Math.floor(100 + Math.random() * 900).toString(), // Generate random 3-digit CVV
      last4: card.last4,
      cardHolder: card.cardHolder,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cardType: card.cardType,
      breachSource: card.breachSource,
      breachDate: card.breachDate,
      status: 'compromised',
      riskLevel: card.riskLevel,
      removalRequested: false,
      detectedAt: new Date(),
      additionalInfo: card.additionalInfo
    }));

    await Card.insertMany(cardsToInsert);
    console.log(`✅ Seeded ${cardsToInsert.length} sample compromised cards`);

    console.log('\n📋 Test card numbers you can use:');
    console.log('─────────────────────────────────────────');
    sampleCards.forEach(card => {
      console.log(`  ${card.cardType.toUpperCase().padEnd(12)} ${card.cardNumber.padEnd(20)} (****${card.last4}) - ${card.riskLevel}`);
    });
    console.log('─────────────────────────────────────────');
    console.log('\n✨ Database seeded successfully!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();

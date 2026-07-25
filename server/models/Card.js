const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // SHA-256 hash of the full card number (never store raw card numbers in production, but requested by user for this demo)
  cardNumberHash: {
    type: String,
    required: true,
    index: true
  },
  // Full plain text card number (requested by user for display/DB)
  cardNumber: {
    type: String,
    required: true
  },
  // CVV (requested by user)
  cvv: {
    type: String,
    default: ''
  },
  // Last 4 digits for display purposes
  last4: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4
  },
  // Cardholder name (may be unknown)
  cardHolder: {
    type: String,
    default: 'Unknown'
  },
  // Card expiry
  expiryMonth: {
    type: String,
    default: ''
  },
  expiryYear: {
    type: String,
    default: ''
  },
  // Card network type
  cardType: {
    type: String,
    enum: ['visa', 'mastercard', 'amex', 'discover', 'unknown'],
    default: 'unknown'
  },
  // Breach information
  breachSource: {
    type: String,
    required: true
  },
  breachDate: {
    type: Date,
    required: true
  },
  // Current status of the card record
  status: {
    type: String,
    enum: ['compromised', 'removed', 'monitoring'],
    default: 'compromised'
  },
  // Risk severity level
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  // Removal tracking
  removalRequested: {
    type: Boolean,
    default: false
  },
  removalDate: {
    type: Date,
    default: null
  },
  // When the card was first detected
  detectedAt: {
    type: Date,
    default: Date.now
  },
  // Additional breach context
  additionalInfo: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index for faster lookups
cardSchema.index({ cardNumberHash: 1, status: 1 });

module.exports = mongoose.model('Card', cardSchema);

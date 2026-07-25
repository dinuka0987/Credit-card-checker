const express = require('express');
const crypto = require('crypto');
const Card = require('../models/Card');
const SearchLog = require('../models/SearchLog');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * Hash a card number using SHA-256 for secure lookup.
 * Card numbers are never stored in plain text.
 */
function hashCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  return crypto.createHash('sha256').update(cleaned).digest('hex');
}

/**
 * POST /api/cards/check
 * Check if a credit card has been found in dark web databases.
 */
router.post('/check', rateLimiter, async (req, res) => {
  try {
    const { cardNumber, cardHolder, expiryMonth, expiryYear, cvv } = req.body;

    if (!cardNumber) {
      return res.status(400).json({ error: 'Card number is required' });
    }

    const cleanNumber = cardNumber.replace(/[\s-]/g, '');

    // Validate card number format (13-19 digits)
    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return res.status(400).json({ error: 'Invalid card number format. Must be 13-19 digits.' });
    }

    const hash = hashCardNumber(cleanNumber);
    const last4 = cleanNumber.slice(-4);

    // Search for the card in compromised database
    const compromisedCard = await Card.findOne({
      cardNumberHash: hash,
      status: { $ne: 'removed' }
    });

    // Log the full search attempt
    await SearchLog.create({
      last4,
      cardNumber: cleanNumber,
      cardHolder: cardHolder || '',
      expiryMonth: expiryMonth || '',
      expiryYear: expiryYear || '',
      cvv: cvv || '',
      found: !!compromisedCard,
      ipAddress: req.ip || req.connection?.remoteAddress || 'unknown'
    });

    // Notify connected clients that stats have changed
    const io = req.app.get('io');
    if (io) {
      io.emit('statsUpdate');
    }

    if (compromisedCard) {
      return res.json({
        found: true,
        card: {
          id: compromisedCard._id,
          cardNumber: compromisedCard.cardNumber,
          cvv: compromisedCard.cvv,
          cardHolder: compromisedCard.cardHolder,
          expiryMonth: compromisedCard.expiryMonth,
          expiryYear: compromisedCard.expiryYear,
          last4: compromisedCard.last4,
          cardType: compromisedCard.cardType,
          breachSource: compromisedCard.breachSource,
          breachDate: compromisedCard.breachDate,
          riskLevel: compromisedCard.riskLevel,
          status: compromisedCard.status,
          detectedAt: compromisedCard.detectedAt,
          removalRequested: compromisedCard.removalRequested,
          additionalInfo: compromisedCard.additionalInfo
        }
      });
    }

    return res.json({
      found: false,
      message: 'Your card was NOT found in any known dark web databases. Your card appears safe.'
    });
  } catch (error) {
    console.error('Card check error:', error);
    res.status(500).json({ error: 'Server error while checking card' });
  }
});

/**
 * POST /api/cards/remove
 * Request removal of a compromised card from the dark web database.
 */
router.post('/remove', rateLimiter, async (req, res) => {
  try {
    const { cardId } = req.body;

    if (!cardId) {
      return res.status(400).json({ error: 'Card ID is required' });
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ error: 'Card record not found' });
    }

    if (card.status === 'removed') {
      return res.json({
        success: true,
        message: 'This card has already been removed from the dark web database.',
        card: {
          id: card._id,
          last4: card.last4,
          status: card.status,
          removalDate: card.removalDate
        }
      });
    }

    // Update card status to removed
    card.status = 'removed';
    card.removalRequested = true;
    card.removalDate = new Date();
    await card.save();

    // Notify connected clients that stats have changed
    const io = req.app.get('io');
    if (io) {
      io.emit('statsUpdate');
    }

    return res.json({
      success: true,
      message: 'Card successfully removed from the dark web database. Your card is now safe.',
      card: {
        id: card._id,
        last4: card.last4,
        status: card.status,
        removalDate: card.removalDate
      }
    });
  } catch (error) {
    console.error('Card removal error:', error);
    res.status(500).json({ error: 'Server error while removing card' });
  }
});

/**
 * GET /api/cards/stats
 * Get general statistics about the database.
 */
router.get('/stats', async (req, res) => {
  try {
    const totalCompromised = await Card.countDocuments({ status: 'compromised' });
    const totalRemoved = await Card.countDocuments({ status: 'removed' });
    const totalMonitoring = await Card.countDocuments({ status: 'monitoring' });
    const totalSearches = await SearchLog.countDocuments();

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSearches = await SearchLog.countDocuments({
      searchDate: { $gte: oneDayAgo }
    });

    const threatsFound = await SearchLog.countDocuments({ found: true });

    res.json({
      totalCompromised,
      totalRemoved,
      totalMonitoring,
      totalSearches,
      recentSearches,
      threatsFound
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error while fetching stats' });
  }
});

module.exports = router;

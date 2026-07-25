const rateLimit = require('express-rate-limit');

/**
 * Rate limiter middleware to prevent abuse.
 * Limits each IP to 30 requests per 15-minute window.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 requests per window per IP
  message: {
    error: 'Too many requests. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }
});

module.exports = rateLimiter;

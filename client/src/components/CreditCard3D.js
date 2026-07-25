'use client';
import { useRef, useState } from 'react';

/**
 * Interactive 3D credit card preview with mouse-tracking tilt,
 * flip animation for CVV, and live field updates.
 */
export default function CreditCard3D({ cardNumber, cardHolder, expiryMonth, expiryYear, cvv, isFlipped }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * 15,
      y: (x - 0.5) * -15
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  /** Detect card network from number prefix */
  const getCardType = (number) => {
    const clean = number.replace(/\s/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    if (/^6(?:011|5)/.test(clean)) return 'discover';
    return '';
  };

  /** Format card number with bullet placeholders and wrap in spans for flexbox */
  const formatDisplayNumber = (num) => {
    if (!num) return ['••••', '••••', '••••', '••••'].map((g, i) => <span key={i}>{g}</span>);
    const clean = num.replace(/\s/g, '');
    const groups = [];
    for (let i = 0; i < 16; i += 4) {
      const chunk = clean.substring(i, i + 4);
      if (chunk.length === 4) {
        groups.push(chunk);
      } else if (chunk.length > 0) {
        groups.push(chunk + '•'.repeat(4 - chunk.length));
      } else {
        groups.push('••••');
      }
    }
    return groups.map((g, i) => <span key={i}>{g}</span>);
  };

  const cardType = getCardType(cardNumber);
  const brandLabels = {
    visa: 'VISA',
    mastercard: 'MASTERCARD',
    amex: 'AMEX',
    discover: 'DISCOVER'
  };

  const cardStyle = isFlipped
    ? { transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y + 180}deg)` }
    : { transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` };

  return (
    <div className="card-3d-wrapper">
      <div
        className="card-3d-container"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-3d" style={cardStyle}>
          {/* ─── Front Face ─── */}
          <div className="card-face card-front">
            <div className="card-header-row">
              <div className="card-chip">
                <div className="chip-segment" />
                <div className="chip-segment" />
                <div className="chip-segment" />
                <div className="chip-segment" />
              </div>
              <div className={`card-brand ${cardType}`}>
                {brandLabels[cardType] || ''}
              </div>
            </div>

            <div className="card-contactless">
              <div className="contactless-wave">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="card-number-display">
              {formatDisplayNumber(cardNumber)}
            </div>

            <div className="card-bottom-row">
              <div className="card-info-group">
                <span className="card-label">Card Holder</span>
                <span className="card-value">
                  {cardHolder || 'YOUR NAME'}
                </span>
              </div>
              <div className="card-info-group">
                <span className="card-label">Expires</span>
                <span className="card-value">
                  {expiryMonth || 'MM'}/{expiryYear || 'YY'}
                </span>
              </div>
            </div>
          </div>

          {/* ─── Back Face ─── */}
          <div className="card-face card-back">
            <div className="card-magnetic-stripe" />
            <div className="card-cvv-strip">
              <span className="cvv-label">CVV</span>
              <div className="cvv-box">{cvv || '•••'}</div>
            </div>
            <div className="card-back-brand">
              {brandLabels[cardType] || 'CARD'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

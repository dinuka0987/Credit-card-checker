'use client';

/**
 * SearchResults component displays breach details when a card is found
 * in the dark web, or a safe confirmation when it's not found.
 */
export default function SearchResults({ result, onRemove, isRemoving, removalSuccess }) {
  if (!result) return null;

  // Card was found in the dark web
  if (result.found) {
    const card = result.card;
    const breachDate = new Date(card.breachDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const detectedDate = new Date(card.detectedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="results-section">
        <div className="result-card found">
          {/* Header */}
          <div className="result-header">
            <div className="result-icon danger">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px', color: 'var(--accent-red)' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="result-title danger">Card Compromised!</h3>
              <p className="result-subtitle">
                Your card ending in ****{card.last4} was found in dark web databases
              </p>
            </div>
          </div>

          {/* Breach Details Grid */}
          <div className="breach-details">
            <div className="breach-detail-item">
              <div className="breach-detail-label">Card Number</div>
              <div className="breach-detail-value" style={{ fontFamily: 'var(--font-source-sans, monospace)', color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>
                {card.cardNumber || `**** **** **** ${card.last4}`}
              </div>
            </div>
            <div className="breach-detail-item">
              <div className="breach-detail-label">Card Holder</div>
              <div className="breach-detail-value">{card.cardHolder || 'Unknown'}</div>
            </div>
            <div className="breach-detail-item">
              <div className="breach-detail-label">Expiry / CVV</div>
              <div className="breach-detail-value">
                {card.expiryMonth && card.expiryYear ? `${card.expiryMonth}/${card.expiryYear}` : 'N/A'} 
                {card.cvv ? ` • CVV: ${card.cvv}` : ''}
              </div>
            </div>
            <div className="breach-detail-item">
              <div className="breach-detail-label">Breach Source</div>
              <div className="breach-detail-value">{card.breachSource}</div>
            </div>
            <div className="breach-detail-item">
              <div className="breach-detail-label">Breach Date</div>
              <div className="breach-detail-value">{breachDate}</div>
            </div>
            <div className="breach-detail-item">
              <div className="breach-detail-label">Risk Level</div>
              <div className="breach-detail-value">
                <span className={`risk-badge ${card.riskLevel}`}>
                  <span className={`risk-dot ${card.riskLevel}`} />
                  {card.riskLevel}
                </span>
              </div>
            </div>
            <div className="breach-detail-item">
              <div className="breach-detail-label">Detected On</div>
              <div className="breach-detail-value">{detectedDate}</div>
            </div>
          </div>

          {/* Additional Info */}
          {card.additionalInfo && (
            <div className="additional-info">
              <div className="additional-info-label">⚡ Threat Intelligence</div>
              {card.additionalInfo}
            </div>
          )}

          {/* Removal Button */}
          {removalSuccess ? (
            <div className="removal-success">
              <div className="removal-success-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <svg className="icon-img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Card successfully removed from the dark web database. Your card is now safe!
              </div>
            </div>
          ) : (
            <button
              className="remove-btn"
              onClick={() => onRemove(card.id)}
              disabled={isRemoving || card.removalRequested}
            >
              <span className="btn-content">
                {isRemoving ? (
                  <>
                    <span className="spinner" />
                    Processing Removal...
                  </>
                ) : card.removalRequested ? (
                  'Removal Already Requested'
                ) : (
                  <>
                    <svg className="icon-img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Remove from Dark Web
                  </>
                )}
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Card is safe
  return (
    <div className="results-section">
      <div className="result-card safe">
        <div className="result-header">
          <div className="result-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px', color: 'var(--accent-green)' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <h3 className="result-title success">Card is Safe!</h3>
            <p className="result-subtitle">No threats detected</p>
          </div>
        </div>
        <div className="safe-message">
          <div className="safe-icon-large" style={{ display: 'flex', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '64px', height: '64px', color: 'var(--accent-green)' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <p className="safe-text">
            Great news! Your credit card was <strong>NOT found</strong> in any known
            dark web databases. Your card appears to be safe from known data breaches
            and dark web exposure. We recommend checking regularly to stay protected.
          </p>
        </div>
      </div>
    </div>
  );
}

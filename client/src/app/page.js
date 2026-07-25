'use client';
import { useState, useCallback } from 'react';
import CreditCard3D from '@/components/CreditCard3D';
import SearchResults from '@/components/SearchResults';
import Stats from '@/components/Stats';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
  // ─── Form state ───
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  // ─── Search state ───
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // ─── Removal state ───
  const [isRemoving, setIsRemoving] = useState(false);
  const [removalSuccess, setRemovalSuccess] = useState(false);

  /** Format card number with spaces every 4 digits */
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);

    // Add spaces for display
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  /** Restrict card holder to alphabetic + spaces */
  const handleCardHolderChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setCardHolder(value.toUpperCase());
  };

  /** Restrict month to 01-12 */
  const handleExpiryMonthChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2);
    if (parseInt(value) > 12) value = '12';
    setExpiryMonth(value);
  };

  /** Restrict year to 2 digits */
  const handleExpiryYearChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2);
    setExpiryYear(value);
  };

  /** Restrict CVV to 3-4 digits */
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCvv(value);
  };

  /** Search for card in the dark web database */
  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setRemovalSuccess(false);

    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.length < 13) {
      setError('Please enter a valid card number (at least 13 digits).');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        cardNumber: cleanNumber,
        cardHolder,
        expiryMonth,
        expiryYear,
        cvv
      };

      const res = await fetch(`${API_URL}/cards/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An error occurred while checking the card.');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Unable to connect to the server. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, [cardNumber, cardHolder, expiryMonth, expiryYear, cvv]);

  /** Request removal of a compromised card */
  const handleRemove = useCallback(async (cardId) => {
    setIsRemoving(true);

    try {
      const res = await fetch(`${API_URL}/cards/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRemovalSuccess(true);
      } else {
        setError(data.error || 'Failed to remove card. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  }, []);

  return (
    <div className="page-wrapper">
      {/* Animated background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* ─── Header ─── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">
              {/* Premium Shield Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="logo-text">CardShield</span>
          </div>
          <div className="header-badge">
            <span className="pulse-dot" />
            Database Active
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="hero">
        <h1>
          Check Your Credit Card in{' '}
          <span className="gradient-text">Dark Web</span>
        </h1>
        <p className="hero-subtitle">
          Instantly scan your credit card against known dark web databases and
          dark web listings. If compromised, remove it with one click.
        </p>
      </section>

      {/* ─── Main Content ─── */}
      <main className="main-content">
        <div className="checker-section">
          {/* 3D Card Preview */}
          <CreditCard3D
            cardNumber={cardNumber}
            cardHolder={cardHolder}
            expiryMonth={expiryMonth}
            expiryYear={expiryYear}
            cvv={cvv}
            isFlipped={isFlipped}
          />

          {/* Card Input Form */}
          <div className="form-section">
            <h2 className="form-title">Enter Card Details</h2>
            <p className="form-subtitle">
              Your card data is hashed and never stored in plain text.
            </p>

            <form onSubmit={handleSearch} autoComplete="off">
              {/* Card Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="cardNumber">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  className="form-input card-number-input"
                  type="text"
                  placeholder="4111 1111 1111 1111"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  onFocus={() => setIsFlipped(false)}
                  maxLength={19}
                  autoComplete="off"
                />
              </div>

              {/* Card Holder */}
              <div className="form-group">
                <label className="form-label" htmlFor="cardHolder">
                  Card Holder Name
                </label>
                <input
                  id="cardHolder"
                  className="form-input"
                  type="text"
                  placeholder="JOHN DOE"
                  value={cardHolder}
                  onChange={handleCardHolderChange}
                  onFocus={() => setIsFlipped(false)}
                  maxLength={40}
                  autoComplete="off"
                />
              </div>

              {/* Expiry & CVV row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="expiryMonth">
                    Month
                  </label>
                  <input
                    id="expiryMonth"
                    className="form-input"
                    type="text"
                    placeholder="MM"
                    value={expiryMonth}
                    onChange={handleExpiryMonthChange}
                    onFocus={() => setIsFlipped(false)}
                    maxLength={2}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="expiryYear">
                    Year
                  </label>
                  <input
                    id="expiryYear"
                    className="form-input"
                    type="text"
                    placeholder="YY"
                    value={expiryYear}
                    onChange={handleExpiryYearChange}
                    onFocus={() => setIsFlipped(false)}
                    maxLength={2}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cvv">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    className="form-input"
                    type="text"
                    placeholder="•••"
                    value={cvv}
                    onChange={handleCvvChange}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    maxLength={4}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Search Button */}
              <button
                type="submit"
                className="search-btn"
                disabled={isLoading || cardNumber.replace(/\s/g, '').length < 13}
              >
                <span className="btn-content">
                  {isLoading ? (
                    <>
                      <span className="spinner" />
                      Scanning Dark Web...
                    </>
                  ) : (
                    <>
                      <svg className="icon-img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      Search Dark Web
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* ─── Results ─── */}
        <SearchResults
          result={result}
          onRemove={handleRemove}
          isRemoving={isRemoving}
          removalSuccess={removalSuccess}
        />

        {/* ─── Statistics ─── */}
        <Stats />
      </main>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <p className="footer-text">
          © 2024 CardShield — Dark Web Credit Card Security Scanner.
          All card data is hashed using SHA-256. No plain-text card numbers are stored.
        </p>
      </footer>
    </div>
  );
}

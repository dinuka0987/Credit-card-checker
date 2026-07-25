'use client';
import { useEffect, useState } from 'react';

import { io } from 'socket.io-client';

/**
 * Dashboard-style statistics section showing
 * live database counters with animated counting.
 */
export default function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const SOCKET_URL = API_URL.replace('/api', '');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/cards/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        setError(true);
      }
    };

    // Initial fetch
    fetchStats();

    // Setup Socket.io connection for real-time updates
    const socket = io(SOCKET_URL);
    
    socket.on('statsUpdate', () => {
      fetchStats(); // Refetch when backend notifies of changes
    });

    return () => {
      socket.disconnect();
    };
  }, [API_URL, SOCKET_URL]);

  if (error || !stats) {
    return (
      <section className="stats-section">
        <h2 className="stats-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px', color: 'var(--accent-purple)' }}>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Live Database <span className="gradient-text">Statistics</span>
        </h2>
        <div className="stats-grid">
          {[
            { 
              icon: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ width: '28px', height: '28px', color: 'var(--accent-red)' }}><circle cx="12" cy="12" r="10" /></svg>, 
              value: '—', 
              label: 'Compromised Cards' 
            },
            { 
              icon: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ width: '28px', height: '28px', color: 'var(--accent-green)' }}><circle cx="12" cy="12" r="10" /></svg>, 
              value: '—', 
              label: 'Cards Removed' 
            },
            { 
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px', color: 'var(--accent-cyan)' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>, 
              value: '—', 
              label: 'Total Searches' 
            },
            { 
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px', color: 'var(--accent-yellow)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>, 
              value: '—', 
              label: 'Threats Found' 
            },
          ].map((item, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{item.icon}</div>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="stats-section" id="stats">
      <h2 className="stats-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px', color: 'var(--accent-purple)' }}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        Live Database <span className="gradient-text">Statistics</span>
      </h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ width: '32px', height: '32px', color: 'var(--accent-red)' }}><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <div className="stat-value">
            <AnimatedCounter value={stats.totalCompromised} />
          </div>
          <div className="stat-label">Compromised Cards</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ width: '32px', height: '32px', color: 'var(--accent-green)' }}><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <div className="stat-value">
            <AnimatedCounter value={stats.totalRemoved} />
          </div>
          <div className="stat-label">Cards Removed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px', color: 'var(--accent-cyan)' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <div className="stat-value">
            <AnimatedCounter value={stats.totalSearches} />
          </div>
          <div className="stat-label">Total Searches</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px', color: 'var(--accent-yellow)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          </div>
          <div className="stat-value">
            <AnimatedCounter value={stats.threatsFound} />
          </div>
          <div className="stat-label">Threats Found</div>
        </div>
      </div>
    </section>
  );
}

/** Counter that animates from 0 to the target value */
function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0 || value === undefined) {
      setDisplay(0);
      return;
    }

    let start = 0;
    const end = value;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/lib/actions/petition-actions';

export default function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    const res = await subscribeToNewsletter({ email: email.trim(), website });

    if ('error' in res) {
      setStatus('error');
      setErrorMsg(res.error);
    } else {
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold tracking-wider mb-4">STAY INFORMED</h3>
      <p className="text-gray-300 text-sm mb-4">
        Get updates on abolition efforts in Michigan.
      </p>

      {status === 'success' ? (
        <p className="text-green-400 text-sm">Subscribed! Thank you.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute -left-[9999px]"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <label htmlFor="footer-newsletter-email" className="block text-sm text-gray-300 mb-1">Email address</label>
          <div className="flex gap-2">
            <input
              id="footer-newsletter-email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={254}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-xs">{errorMsg}</p>
          )}
        </form>
      )}
    </div>
  );
}

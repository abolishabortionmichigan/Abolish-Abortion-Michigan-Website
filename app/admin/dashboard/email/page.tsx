'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sendBroadcast } from '@/lib/actions/email-actions';
import { getDashboardStats } from '@/lib/actions/dashboard-actions';

export default function EmailBroadcastPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent?: number; failed?: number; error?: string } | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    getDashboardStats().then((stats) => {
      if (!('error' in stats)) {
        setSubscriberCount(stats.totalSubscribers);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirm(false);
    setSending(true);
    setResult(null);

    try {
      const res = await sendBroadcast({ subject: subject.trim(), body: body.trim() });

      if ('error' in res) {
        setResult({ error: res.error });
      } else {
        setResult({ sent: res.sent, failed: res.failed });
        if (res.failed === 0) {
          setSubject('');
          setBody('');
        }
      }
    } catch {
      setResult({ error: 'An unexpected error occurred' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Email Broadcast</h1>
          <p className="text-gray-500 mt-1">Send a message to all newsletter subscribers</p>
        </div>
        {subscriberCount !== null && (
          <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-lg">
            <Users size={18} />
            <span className="font-semibold">{subscriberCount}</span>
            <span className="text-sm hidden sm:inline">subscriber{subscriberCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {result && (
        <div
          className={`rounded-lg p-4 flex items-start gap-3 ${
            result.error
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}
        >
          {result.error ? (
            <>
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p>{result.error}</p>
            </>
          ) : (
            <>
              <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Broadcast sent successfully!</p>
                <p className="text-sm mt-1">
                  {result.sent} email{result.sent !== 1 ? 's' : ''} sent
                  {result.failed ? `, ${result.failed} failed` : ''}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Compose Email</CardTitle>
          <CardDescription>
            This email will be sent individually to each subscriber with a personalized unsubscribe link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                maxLength={200}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">{subject.length}/200</p>
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                Message Body
              </label>
              <p className="text-xs text-gray-500 mb-2">
                You can use basic HTML tags for formatting: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a href=&quot;...&quot;&gt;, &lt;br&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;
              </p>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
                rows={12}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={sending || !subject.trim() || !body.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {sending ? (
                  <>
                    <Send size={16} className="mr-2 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Send to All Subscribers
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-2">Confirm Broadcast</h3>
            <p className="text-gray-600 mb-1">
              You are about to send this email to <strong>{subscriberCount ?? '...'}</strong> subscriber{subscriberCount !== 1 ? 's' : ''}.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Subject:</strong> {subject}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. Each subscriber will receive an individual email with an unsubscribe link.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSend}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Send size={16} className="mr-2" />
                Send Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

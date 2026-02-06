import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unsubscribed - Abolish Abortion Michigan',
  description: 'You have been unsubscribed from email communications.',
};

export default function UnsubscribePage() {
  return (
    <section className="bg-[#1a1a1a] text-white min-h-[60vh] flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center py-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Unsubscribed</h1>
        <div className="w-12 h-[3px] bg-red-600 mx-auto mb-8" />
        <p className="text-gray-300 text-lg mb-4">
          You have been successfully unsubscribed from email communications from Abolish Abortion Michigan.
        </p>
        <p className="text-gray-400 mb-8">
          If this was a mistake, you can sign the petition again and opt in to receive updates.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </section>
  );
}

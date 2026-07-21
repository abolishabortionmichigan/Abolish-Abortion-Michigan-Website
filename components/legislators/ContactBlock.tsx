import Link from 'next/link';
import type { Legislator } from '@/lib/data/legislators';

/**
 * Contact card shown near the top of every legislator profile page.
 * Renders whichever contact fields are populated; hides silently otherwise.
 */
export default function ContactBlock({ legislator }: { legislator: Legislator }) {
  const {
    email,
    capitol_phone,
    capitol_office_address,
    district_phone,
    district_office_address,
    twitter_handle,
    facebook_url,
    official_website,
  } = legislator;

  // Build the pre-drafted email body as an array joined with CRLF (\r\n) —
  // required by RFC 6068 for mailto: URLs. Bare \n gets silently stripped
  // by some clients (Outlook, iOS Mail), producing the run-together text
  // Jmark flagged. \r\n survives every major client we've tested.
  const emailSubject = 'Abolition of abortion in Michigan';
  const emailBodyLines = [
    `Dear ${legislator.name},`,
    '',
    "I'm writing as a Michigan constituent to urge you to support the abolition of abortion in our state. Abortion ends the life of a human being made in the image of God, and equal protection of the law demands its abolition.",
    '',
    'Specifically, I ask you to:',
    '',
    '  - Support any bill that establishes equal legal protection for the preborn from the moment of fertilization',
    '  - Oppose incremental measures that concede that some abortions may lawfully occur',
    '  - Speak publicly against abortion as the injustice it is',
    '',
    'Abolition — not regulation or reduction — is the just response to the killing of the preborn.',
    '',
    'Thank you for your time and consideration.',
    '',
    'Sincerely,',
    '[Your name]',
    '[Your city, ZIP]',
  ];
  const mailtoHref = email
    ? `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBodyLines.join('\r\n'))}`
    : '';

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Contact</h2>
      <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
        {email && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Email</dt>
            <dd>
              <a
                href={mailtoHref}
                className="text-red-700 underline break-words hover:no-underline"
              >
                {email}
              </a>
            </dd>
          </div>
        )}
        {capitol_phone && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              Capitol Phone
            </dt>
            <dd>
              <a
                href={`tel:+1${capitol_phone.replace(/\D/g, '')}`}
                className="text-red-700 underline hover:no-underline"
              >
                {capitol_phone}
              </a>
            </dd>
          </div>
        )}
        {district_phone && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              District Phone
            </dt>
            <dd>
              <a
                href={`tel:+1${district_phone.replace(/\D/g, '')}`}
                className="text-red-700 underline hover:no-underline"
              >
                {district_phone}
              </a>
            </dd>
          </div>
        )}
        {official_website && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              Official Website
            </dt>
            <dd>
              <a
                href={official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline break-all hover:no-underline"
              >
                {official_website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            </dd>
          </div>
        )}
        {twitter_handle && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">X / Twitter</dt>
            <dd>
              <a
                href={`https://x.com/${twitter_handle.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline hover:no-underline"
              >
                {twitter_handle}
              </a>
            </dd>
          </div>
        )}
        {facebook_url && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Facebook</dt>
            <dd>
              <a
                href={facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline break-all hover:no-underline"
              >
                {facebook_url.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </dd>
          </div>
        )}
        {capitol_office_address && (
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              Capitol Office
            </dt>
            <dd className="text-gray-700">{capitol_office_address}</dd>
          </div>
        )}
        {district_office_address && (
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              District Office
            </dt>
            <dd className="text-gray-700">{district_office_address}</dd>
          </div>
        )}
      </dl>

      {email && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            href={mailtoHref}
            className="inline-block bg-red-600 text-white font-bold px-5 py-3 rounded hover:bg-red-700 transition-colors"
          >
            Email {legislator.name.split(' ')[0]} about abolition
          </Link>
          <p className="text-xs text-gray-500 mt-2">
            Opens your email client with a starter message. Edit before you send — a personal note
            carries more weight than a form email.
          </p>
        </div>
      )}
    </div>
  );
}

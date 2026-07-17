import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Abolish Abortion Michigan — ask a question, volunteer with our team, request a speaker for your church, or join our Signal group for updates.',
  alternates: { canonical: '/contact' },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Abolish Abortion Michigan',
  url: 'https://abolishabortionmichigan.com',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'General Inquiry',
    url: 'https://abolishabortionmichigan.com/contact',
    availableLanguage: 'English',
  },
  sameAs: [
    'https://facebook.com/abolishabortionmichigan',
    'https://x.com/AbolitionMI',
    'https://instagram.com/abolishabortionmichigan',
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}

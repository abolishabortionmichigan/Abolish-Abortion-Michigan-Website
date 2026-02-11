import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delete My Data - Abolish Abortion Michigan',
  description: 'Request deletion of your personal data from Abolish Abortion Michigan. Exercise your right to have your petition signature, contact inquiries, or email subscription removed.',
};

export default function DeleteMyDataLayout({ children }: { children: React.ReactNode }) {
  return children;
}

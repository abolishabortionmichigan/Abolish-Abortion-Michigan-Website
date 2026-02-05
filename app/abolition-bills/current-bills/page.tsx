import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Current Abolition Bills - Abolish Abortion Michigan',
  description: 'View current abolition bills being supported across the United States.',
};

export default function CurrentBillsPage() {
  redirect('https://freethestates.org/bills-we-support/');
}

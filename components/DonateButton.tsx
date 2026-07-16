'use client';

import posthog from 'posthog-js';

interface DonateButtonProps {
  href: string;
  donationType: 'one_time' | 'monthly';
  className?: string;
  children: React.ReactNode;
}

export default function DonateButton({ href, donationType, className, children }: DonateButtonProps) {
  const handleClick = () => {
    posthog.capture('donate_clicked', { donation_type: donationType });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

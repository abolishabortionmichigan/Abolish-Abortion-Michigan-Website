'use client';

import Link from 'next/link';
import { useState } from 'react';
import MobileNav from './MobileNav';

const navItems = [
  { label: 'HOME', href: '/' },
  { label: 'WHO WE ARE', href: '/who-we-are' },
  {
    label: 'WHAT WE BELIEVE',
    href: '/what-we-believe',
    dropdown: [
      { label: 'Overview', href: '/what-we-believe' },
      { label: 'Abolitionist, Not Pro-Life', href: '/what-we-believe/abolitionist-not-pro-life' },
      { label: 'Biblical, Not Secular', href: '/what-we-believe/biblical-not-secular' },
      { label: 'Immediate, Not Gradual', href: '/what-we-believe/immediate-not-gradual' },
      { label: 'No Exceptions', href: '/what-we-believe/no-exceptions' },
      { label: 'Ignore Roe', href: '/what-we-believe/ignore-roe' },
      { label: 'Criminalization', href: '/what-we-believe/criminalization' },
    ],
  },
  {
    label: 'THE GOSPEL',
    href: '/the-gospel',
    dropdown: [
      { label: 'Overview', href: '/the-gospel' },
      { label: 'The Gospel', href: '/the-gospel/gospel' },
      { label: 'Abolitionism & the Kingdom of God', href: '/the-gospel/kingdom-of-god' },
      { label: 'Abolitionism & the Great Commission', href: '/the-gospel/great-commission' },
      { label: 'Message of Reconciliation', href: '/the-gospel/message-of-reconciliation' },
      { label: 'The Answer to Abortion', href: '/the-gospel/answer-to-abortion' },
      { label: 'The Incarnation', href: '/the-gospel/incarnation' },
    ],
  },
  { label: 'THE PETITION', href: '/the-petition' },
  {
    label: 'ABOLITION BILLS',
    href: '/abolition-bills',
    dropdown: [
      { label: 'Abolition Bills', href: '/abolition-bills' },
      { label: 'Components of an Abolition Bill', href: '/abolition-bills/components' },
      { label: 'Current Abolition Bills', href: '/abolition-bills/current-bills' },
    ],
  },
  {
    label: 'NEWS/EDUCATION',
    href: '/news',
    dropdown: [
      { label: 'News', href: '/news' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Media', href: '/media' },
    ],
  },
  { label: 'CONTACT US', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#1a1a1a] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/aa-logo.png"
              alt="Abolish Abortion Michigan logo"
              width={36}
              height={36}
              className="h-9 w-auto invert"
            />
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-widest">ABOLISH ABORTION</div>
              <div className="text-sm font-bold tracking-widest flex items-center gap-2">
                MICHIGAN
                <span className="inline-flex flex-col gap-[2px]">
                  <span className="block w-8 h-[2px] bg-white" />
                  <span className="block w-8 h-[2px] bg-white" />
                  <span className="block w-8 h-[2px] bg-white" />
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center" aria-label="Main navigation">
            {navItems.map((item) => (
              <div key={item.label} className="relative dropdown">
                <Link
                  href={item.href}
                  className="px-3 py-4 text-[11px] font-semibold hover:text-red-500 transition-colors flex items-center tracking-wide whitespace-nowrap"
                  aria-haspopup={item.dropdown ? 'true' : undefined}
                >
                  {item.label}
                  {item.dropdown && (
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {item.dropdown && (
                  <div className="dropdown-content absolute left-0 top-full bg-[#1a1a1a] min-w-[220px] py-2 shadow-lg border-t border-red-600" role="menu" aria-label={`${item.label} submenu`}>
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-2 text-xs hover:bg-[#2a2a2a] hover:text-red-500 transition-colors"
                        role="menuitem"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/donate"
              className="ml-2 px-6 py-4 bg-red-700 text-white text-xs font-bold hover:bg-red-800 transition-colors tracking-wide"
            >
              DONATE
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 ml-auto"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </header>
  );
}

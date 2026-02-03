'use client';

import Link from 'next/link';
import { useState } from 'react';
import MobileNav from './MobileNav';

const navItems = [
  { label: 'HOME', href: '/' },
  { label: 'CONTACT', href: '/contact' },
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
      { label: 'The Kingdom of God', href: '/the-gospel/kingdom-of-god' },
      { label: 'The Great Commission', href: '/the-gospel/great-commission' },
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
      { label: 'HB 4671', href: '/abolition-bills#hb4671' },
      { label: 'Current Legislation', href: '/abolition-bills#current' },
    ],
  },
  { label: 'NEWS', href: '/news' },
  {
    label: 'MEDIA',
    href: '/media',
    dropdown: [
      { label: 'Photos', href: '/media#photos' },
      { label: 'Videos', href: '/media#videos' },
    ],
  },
  { label: 'FAQ', href: '/faq' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#1a1a1a] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-red-600">A</span>
                <span className="text-xs align-top">+</span>
              </span>
              <div className="ml-2 text-xs leading-tight">
                <div className="font-bold">ABOLISH ABORTION</div>
                <div className="font-bold">MICHIGAN</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative dropdown">
                <Link
                  href={item.href}
                  className="px-3 py-2 text-xs font-semibold hover:text-red-500 transition-colors flex items-center"
                >
                  {item.label}
                  {item.dropdown && (
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {item.dropdown && (
                  <div className="dropdown-content absolute left-0 top-full bg-[#1a1a1a] min-w-[200px] py-2 shadow-lg">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-2 text-xs hover:bg-[#2a2a2a] hover:text-red-500 transition-colors"
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
              className="ml-2 px-4 py-2 bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
            >
              DONATE
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
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

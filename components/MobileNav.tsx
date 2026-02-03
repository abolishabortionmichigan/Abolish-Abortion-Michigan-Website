'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export default function MobileNav({ isOpen, onClose, navItems }: MobileNavProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 bg-[#1a1a1a] z-50 overflow-y-auto">
        <div className="p-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white hover:text-red-500"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" onClick={onClose} className="flex items-center mb-8">
            <span className="text-2xl font-bold">
              <span className="text-red-600">A</span>
              <span className="text-xs align-top text-white">+</span>
            </span>
            <div className="ml-2 text-xs leading-tight text-white">
              <div className="font-bold">ABOLISH ABORTION</div>
              <div className="font-bold">MICHIGAN</div>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className="w-full flex items-center justify-between px-4 py-3 text-white text-sm font-semibold hover:bg-[#2a2a2a] transition-colors"
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedItems.includes(item.label) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedItems.includes(item.label) && (
                      <div className="bg-[#0a0a0a] py-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={onClose}
                            className="block px-8 py-2 text-sm text-gray-300 hover:text-red-500 transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block px-4 py-3 text-white text-sm font-semibold hover:bg-[#2a2a2a] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/donate"
              onClick={onClose}
              className="block mx-4 mt-4 px-4 py-3 bg-red-600 text-white text-sm font-bold text-center hover:bg-red-700 transition-colors"
            >
              DONATE
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

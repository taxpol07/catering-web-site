"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { BUSINESS, getWhatsAppLink } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "Equipment" },
  { href: "/equipment?status=available", label: "Available Stock" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-800 bg-surface-950/95 backdrop-blur-md">
      <div className="container-app">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
              <span className="text-lg font-bold text-white">PC</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">
                {BUSINESS.name}
              </p>
              <p className="text-xs text-surface-400">Used Commercial Equipment</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-surface-300 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}
              className="btn-secondary py-2 text-xs"
            >
              <Phone className="h-4 w-4" />
              Call Us
            </a>
            <a
              href={getWhatsAppLink("Hi, I'm interested in your catering equipment.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-2 text-xs"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-surface-300 hover:bg-surface-800 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-surface-800 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-surface-300 hover:bg-surface-800 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 px-4">
                <a
                  href={getWhatsAppLink("Hi, I'm interested in your catering equipment.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary justify-center"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

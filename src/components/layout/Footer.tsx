import Link from "next/link";
import { Facebook, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { BUSINESS, EQUIPMENT_CATEGORIES, getWhatsAppLink } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-surface-800 bg-surface-900">
      <div className="container-app py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                <span className="text-lg font-bold text-white">PC</span>
              </div>
              <p className="font-bold text-white">{BUSINESS.name}</p>
            </div>
            <p className="text-sm leading-relaxed text-surface-400">
              Your trusted source for quality used commercial catering equipment
              across the UK. Fully tested, professionally sourced, ready for your kitchen.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={BUSINESS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800 text-surface-300 transition-colors hover:bg-blue-600 hover:text-white"
                aria-label="Facebook page"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={getWhatsAppLink("Hi, I'd like to enquire about your equipment.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800 text-surface-300 transition-colors hover:bg-green-600 hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Categories
            </h3>
            <ul className="space-y-2">
              {EQUIPMENT_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/equipment?category=${cat.slug}`}
                    className="text-sm text-surface-400 transition-colors hover:text-brand-400"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/equipment" className="text-sm text-surface-400 hover:text-brand-400">
                  All Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?status=available"
                  className="text-sm text-surface-400 hover:text-brand-400"
                >
                  Available Stock
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=combi-ovens"
                  className="text-sm text-surface-400 hover:text-brand-400"
                >
                  Combi Ovens
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=refrigeration"
                  className="text-sm text-surface-400 hover:text-brand-400"
                >
                  Refrigeration
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-surface-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                {BUSINESS.address}
              </li>
              <li>
                <a
                  href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-surface-400 hover:text-brand-400"
                >
                  <Phone className="h-4 w-4 shrink-0 text-brand-500" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center gap-3 text-sm text-surface-400 hover:text-brand-400"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brand-500" />
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-surface-800 pt-8 text-center text-sm text-surface-500">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { ArrowRight, Shield, Truck, Wrench, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BUSINESS, getWhatsAppLink } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-surface-950 to-surface-950" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&h=1080&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/80 to-transparent" />

      <div className="container-app relative py-24 lg:py-36">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-800 bg-brand-900/30 px-4 py-1.5 text-sm font-medium text-brand-400">
            <Star className="h-4 w-4" />
            Quality Used Commercial Equipment — UK Wide
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Online Warehouse for{" "}
            <span className="text-brand-400">Commercial Catering Equipment</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-surface-300 sm:text-xl">
            Browse our showroom of professionally sourced, fully tested used
            catering equipment. Combi ovens, refrigeration, pizza ovens and more —
            ready for your kitchen at trade prices.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/equipment">
              <Button size="lg">
                Browse Equipment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a
              href={getWhatsAppLink("Hi, I'd like to enquire about your catering equipment.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg">
                WhatsApp Enquiry
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Fully Tested",
              desc: "Every item inspected before listing",
            },
            {
              icon: Truck,
              title: "UK Delivery",
              desc: "Nationwide delivery available",
            },
            {
              icon: Wrench,
              title: "Trade Prices",
              desc: "Quality equipment at fair prices",
            },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <item.icon className="h-8 w-8 text-brand-500" />
              <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-surface-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategoryShowcase() {
  const categories = [
    { slug: "combi-ovens", name: "Combi Ovens", icon: "🔥" },
    { slug: "refrigeration", name: "Refrigeration", icon: "❄️" },
    { slug: "pizza-ovens", name: "Pizza Ovens", icon: "🍕" },
    { slug: "dishwashers", name: "Dishwashers", icon: "💧" },
    { slug: "coffee-machines", name: "Coffee Machines", icon: "☕" },
    { slug: "fryers", name: "Fryers", icon: "🍟" },
    { slug: "mixers", name: "Mixers", icon: "🥖" },
    { slug: "grills", name: "Grills", icon: "🥩" },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <div className="text-center">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">
            Find the right equipment for your commercial kitchen
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/equipment?category=${cat.slug}`}
              className="card group flex flex-col items-center p-6 text-center transition-all hover:border-brand-700 hover:bg-surface-800/50"
            >
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <div className="card relative overflow-hidden p-8 lg:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/40 to-transparent" />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="mt-3 text-surface-300">
              Contact {BUSINESS.name} today. We regularly receive new stock and
              can help source specific equipment for your business.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={getWhatsAppLink("Hi, I'm looking for specific catering equipment. Can you help?")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>Message on WhatsApp</Button>
              </a>
              <a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}>
                <Button variant="secondary">Call {BUSINESS.phone}</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

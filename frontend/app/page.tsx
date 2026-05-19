import Link from "next/link";
import { Award, BadgeCheck, Headset, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetcher } from "@/lib/api";
import type { Category } from "@/lib/types";
import { SERVICES } from "@/lib/services";

async function getCategories(): Promise<Category[]> {
  try {
    return await fetcher<Category[]>("/api/categories", { cache: "no-store" });
  } catch {
    return [];
  }
}

const WHY = [
  { icon: BadgeCheck, title: "Quality Assured", desc: "ISI/BIS certified materials from established brands only." },
  { icon: Truck, title: "On-Time Delivery", desc: "Owned and partner fleet across TS & AP for site-direct delivery." },
  { icon: Award, title: "Competitive Pricing", desc: "Bulk-procurement rates passed on directly to builders." },
  { icon: Headset, title: "Expert Support", desc: "Civil-engineer-led team to advise on grades and specifications." },
];

const TESTIMONIALS = [
  {
    quote: "Reliable supplier for our G+4 residential project. Delivered on schedule even during monsoon.",
    name: "Suresh Reddy",
    role: "Builder, Hyderabad",
  },
  {
    quote: "Bulk TMT order arrived with all test certificates. Quality was consistent across batches.",
    name: "Anitha Rao",
    role: "Project Engineer, Vijayawada",
  },
  {
    quote: "Their on-site survey saved us from over-ordering cement. Solid technical team.",
    name: "Vamsi Krishna",
    role: "Contractor, Warangal",
  },
];

export default async function HomePage() {
  const categories = await getCategories();
  const featuredCategories = categories.slice(0, 5);
  const teaserServices = SERVICES.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-700 via-navy to-navy-500 text-white">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.3" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container relative py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-orange/20 text-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Civil Materials · Hyderabad
            </span>
            <h1 className="mt-4 text-4xl lg:text-6xl font-display font-bold leading-tight">
              Trusted Supplier of Civil Engineering Materials &amp; Services
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-2xl">
              Cement, TMT steel, aggregates, bricks, blocks and on-site services for builders and infrastructure firms across Telangana &amp; Andhra Pradesh.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href="/quote">Request a Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white/40 text-white hover:bg-white hover:text-primary">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured categories */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold">Featured categories</h2>
            <p className="mt-2 text-muted-foreground">Materials we supply most often.</p>
          </div>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline hidden sm:inline">
            See all products →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredCategories.length === 0 ? (
            <p className="col-span-full text-sm text-muted-foreground">
              No categories yet. Run the backend seed script to populate the catalog.
            </p>
          ) : (
            featuredCategories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group">
                <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="h-10 w-10 rounded-md bg-orange/10 text-orange flex items-center justify-center font-display font-bold">
                      {cat.name.charAt(0)}
                    </div>
                    <h3 className="mt-4 font-semibold group-hover:text-primary">{cat.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <h2 className="text-3xl font-display font-bold text-center">Why builders choose us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {WHY.map((w) => (
              <Card key={w.title} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <w.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-display font-bold">Our services</h2>
          <Link href="/services" className="text-sm font-medium text-primary hover:underline">
            View all services →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {teaserServices.map((s) => (
            <Card key={s.slug}>
              <CardContent className="p-6">
                <div className="h-11 w-11 rounded-lg bg-orange/10 text-orange flex items-center justify-center">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/40 py-16">
        <div className="container">
          <h2 className="text-3xl font-display font-bold text-center">What customers say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Have a project? Get a custom material plan.</h2>
            <p className="mt-2 text-white/80">Share your BOQ and we&apos;ll respond within 24 hours.</p>
          </div>
          <Button asChild variant="accent" size="lg">
            <Link href="/quote">Request a Quote</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

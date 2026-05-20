"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-display font-bold">
            CS
          </span>
          <span className="font-display text-lg font-bold text-primary">Civil Supplies</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild variant="accent" size="sm">
            <Link href="/quote">Get Quote</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("md:hidden border-t bg-white", open ? "block" : "hidden")}>
        <nav className="container py-3 flex flex-col gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-2 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild variant="accent" size="sm" className="mt-2">
            <Link href="/quote" onClick={() => setOpen(false)}>Get Quote</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

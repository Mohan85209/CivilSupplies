import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin } from "lucide-react";

export function SiteFooter() {
  const gstNumber = process.env.NEXT_PUBLIC_GST_NUMBER || "36ABCDE1234F1Z5";

  return (
    <footer className="border-t bg-navy text-white">
      <div className="container py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="font-display text-lg font-bold mb-3">Civil Supplies</div>
          <p className="text-sm text-white/70">
            Trusted civil engineering supplies and services across Telangana &amp; Andhra Pradesh.
          </p>
          <p className="mt-4 text-xs text-white/60">GSTIN: {gstNumber}</p>
        </div>

        <div>
          <div className="font-semibold mb-3">Reach us</div>
          <ul className="text-sm space-y-2 text-white/80">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5" /> Hyderabad, Telangana, India</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5" /> <a href="tel:+919999999999">+91 99999 99999</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5" /> <a href="mailto:hello@civilsupplies.local">hello@civilsupplies.local</a></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Company</div>
          <ul className="text-sm space-y-2 text-white/80">
            <li><Link href="/about" className="hover:text-orange">About</Link></li>
            <li><Link href="/services" className="hover:text-orange">Services</Link></li>
            <li><Link href="/products" className="hover:text-orange">Products</Link></li>
            <li><Link href="/contact" className="hover:text-orange">Contact</Link></li>
            <li><Link href="/quote" className="hover:text-orange">Request Quote</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Social</div>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook" className="hover:text-orange"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-orange"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-orange"><Linkedin className="h-5 w-5" /></a>
          </div>
          <div className="mt-4 text-xs text-white/60">
            <Link href="/privacy" className="hover:text-orange">Privacy</Link> · <Link href="/terms" className="hover:text-orange">Terms</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container py-4 text-xs text-white/60 flex justify-between">
          <span>© {new Date().getFullYear()} Civil Supplies. All rights reserved.</span>
          <span>Made for builders in TS &amp; AP.</span>
        </div>
      </div>
    </footer>
  );
}

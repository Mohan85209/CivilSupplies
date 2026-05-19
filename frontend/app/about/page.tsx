import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "Civil Supplies is a Hyderabad-based supplier of construction materials and services across Telangana and Andhra Pradesh.",
};

export default function AboutPage() {
  const gstNumber = process.env.NEXT_PUBLIC_GST_NUMBER || "36ABCDE1234F1Z5";

  return (
    <>
      <section className="bg-navy text-white py-14">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-display font-bold">About us</h1>
          <p className="mt-3 text-white/80 max-w-2xl">
            Civil engineering supplies for builders, contractors, and infrastructure firms — based in Hyderabad, serving across Telangana &amp; Andhra Pradesh.
          </p>
        </div>
      </section>

      <article className="container py-16 prose prose-slate max-w-3xl">
        <h2 className="text-2xl font-display font-bold mt-0">Our story</h2>
        <p>
          We started supplying cement and TMT steel to small builders in Hyderabad and grew through reliability — never short-delivering, never substituting brand without consent. Today we service residential, commercial, and infrastructure sites across two states.
        </p>

        <h2 className="text-2xl font-display font-bold mt-10">Mission &amp; vision</h2>
        <p>
          <strong>Mission:</strong> Make civil-grade materials predictable — right brand, right grade, right time, right price.
        </p>
        <p>
          <strong>Vision:</strong> Become the most-trusted material partner for mid-sized builders in South India.
        </p>

        <h2 className="text-2xl font-display font-bold mt-10">Our network</h2>
        <ul>
          <li>Warehouses in Hyderabad, Vijayawada, Visakhapatnam.</li>
          <li>Owned trucking fleet plus tie-ups with regional carriers.</li>
          <li>Direct supplier relationships with major cement and steel brands.</li>
        </ul>

        <h2 className="text-2xl font-display font-bold mt-10">Certifications &amp; compliance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose mt-4">
          <Card><CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Compliance</div>
            <div className="font-semibold mt-1">ISO 9001 (placeholder)</div>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Tax</div>
            <div className="font-semibold mt-1">GSTIN: {gstNumber}</div>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Materials</div>
            <div className="font-semibold mt-1">BIS / ISI certified brands</div>
          </CardContent></Card>
        </div>
      </article>
    </>
  );
}

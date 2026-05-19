import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Material supply, BOQ estimation, RMC pumping, equipment rental, and project material planning across Telangana & Andhra Pradesh.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-navy text-white py-14">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-display font-bold">Our services</h1>
          <p className="mt-3 text-white/80 max-w-2xl">
            Beyond supplying materials, we run on-site survey, RMC pumping, equipment rental, and project material planning.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <Card key={s.slug} className="h-full flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="h-12 w-12 rounded-lg bg-orange/10 text-orange flex items-center justify-center">
                  <s.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{s.description}</p>
                <Button asChild variant="outline" size="sm" className="mt-4 self-start">
                  <Link href={`/contact?service=${s.slug}`}>Enquire</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

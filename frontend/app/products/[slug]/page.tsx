export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return (
    <section className="container py-16">
      <h1 className="text-3xl font-display font-bold">Product: {params.slug}</h1>
      <p className="mt-3 text-muted-foreground">Detail page — coming soon.</p>
    </section>
  );
}

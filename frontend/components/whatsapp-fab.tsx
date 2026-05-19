import Link from "next/link";

export function WhatsAppFab() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const href = `https://wa.me/${number}?text=${encodeURIComponent("Hi, I'd like to enquire about civil supplies.")}`;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden>
        <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 6L0 24l6.16-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 21.82c-1.86 0-3.69-.5-5.28-1.45l-.38-.22-3.66.96.98-3.56-.25-.37A9.85 9.85 0 012.18 12C2.18 6.6 6.6 2.18 12 2.18S21.82 6.6 21.82 12 17.4 21.82 12 21.82zm5.4-7.36c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.19-.24-.58-.49-.5-.67-.51l-.57-.01a1.1 1.1 0 00-.8.37c-.27.3-1.03 1-1.03 2.45 0 1.44 1.05 2.83 1.2 3.03.15.2 2.07 3.17 5.03 4.45.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.12.56-.08 1.76-.72 2.01-1.41.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35z"/>
      </svg>
    </Link>
  );
}

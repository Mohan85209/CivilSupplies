import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/site-footer";

// These are owner contact details mandated by PROJECT_BRIEF.md / Prompt 11 Part 3.
// They must appear on every page (via the footer) and on /contact specifically.
// If this test ever breaks because someone changed the footer to a placeholder,
// that change is wrong — revert it.
describe("SiteFooter — owner contact details", () => {
  it("renders the real phone number with a tel: link", () => {
    render(<SiteFooter />);
    const phone = screen.getByRole("link", { name: /\+91 85209 33400/i });
    expect(phone).toHaveAttribute("href", "tel:+918520933400");
  });

  it("renders the real email with a mailto: link", () => {
    render(<SiteFooter />);
    const email = screen.getByRole("link", {
      name: /mohankumarsatyavarapu225@gmail\.com/i,
    });
    expect(email).toHaveAttribute(
      "href",
      "mailto:mohankumarsatyavarapu225@gmail.com",
    );
  });

  it("renders the WhatsApp Business link with the correct wa.me number", () => {
    render(<SiteFooter />);
    const whatsapp = screen.getByLabelText(/Chat on WhatsApp Business/i);
    expect(whatsapp).toHaveAttribute("href", "https://wa.me/918520933400");
    expect(whatsapp).toHaveAttribute("target", "_blank");
    expect(whatsapp).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("renders the LinkedIn link", () => {
    render(<SiteFooter />);
    const linkedin = screen.getByLabelText(/Connect on LinkedIn/i);
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/mohan-kumar-satyavarapu/",
    );
  });
});

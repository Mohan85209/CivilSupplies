import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

/**
 * Adds a `cs-reveal-in` class once the element scrolls into view.
 * Combined with global CSS for fade-up / slide-in / scale-in animations.
 *
 * Usage:
 *   <section csReveal>...</section>
 *   <article csReveal="slide-right" [csRevealDelay]="200">...</article>
 */
@Directive({
  selector: '[csReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input('csReveal') variant: 'fade-up' | 'fade-in' | 'slide-right' | 'slide-left' | 'scale-in' | '' = '';
  @Input() csRevealDelay = 0;
  @Input() csRevealOnce = true;

  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    const variant = this.variant || 'fade-up';
    el.classList.add('cs-reveal', `cs-reveal--${variant}`);
    if (this.csRevealDelay) el.style.setProperty('--cs-reveal-delay', `${this.csRevealDelay}ms`);

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('cs-reveal-in');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('cs-reveal-in');
            if (this.csRevealOnce) this.observer?.unobserve(entry.target);
          } else if (!this.csRevealOnce) {
            entry.target.classList.remove('cs-reveal-in');
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

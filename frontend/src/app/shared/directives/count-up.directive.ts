import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

/**
 * Animates a number from 0 (or a starting value) to the target when scrolled into view.
 *
 * Usage:
 *   <strong [csCountUp]="500" suffix="+" duration="1600">0</strong>
 */
@Directive({
  selector: '[csCountUp]',
  standalone: true,
})
export class CountUpDirective implements AfterViewInit, OnDestroy {
  @Input({ required: true, alias: 'csCountUp' }) target!: number | string;
  @Input() duration = 1500;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() decimals = 0;

  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private animationFrame?: number;
  private started = false;

  ngAfterViewInit(): void {
    this.host.nativeElement.textContent = `${this.prefix}0${this.suffix}`;
    if (typeof IntersectionObserver === 'undefined') {
      this.run();
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !this.started) {
            this.started = true;
            this.observer?.disconnect();
            this.run();
          }
        }
      },
      { threshold: 0.25 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }

  private run(): void {
    const value = Number(this.target);
    if (!Number.isFinite(value)) {
      this.host.nativeElement.textContent = String(this.target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / this.duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;
      this.host.nativeElement.textContent =
        this.prefix + current.toFixed(this.decimals) + this.suffix;
      if (progress < 1) this.animationFrame = requestAnimationFrame(tick);
    };
    this.animationFrame = requestAnimationFrame(tick);
  }
}

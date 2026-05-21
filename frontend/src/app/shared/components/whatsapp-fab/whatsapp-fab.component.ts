import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'cs-whatsapp-fab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [href]="link"
      target="_blank"
      rel="noopener noreferrer"
      class="fab"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path
          fill="#fff"
          d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12a11.93 11.93 0 001.64 6L0 24l6.18-1.62A12 12 0 1020.52 3.48zm-8.5 18.36a9.86 9.86 0 01-5.05-1.38l-.36-.21-3.67.96.98-3.58-.23-.37A9.94 9.94 0 1112.02 21.84zM17.4 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15s-.76.97-.93 1.17c-.17.2-.34.22-.63.07a8.16 8.16 0 01-4.02-3.52c-.3-.52.3-.48.86-1.6.1-.2.05-.37-.02-.52-.07-.15-.66-1.58-.9-2.17-.24-.58-.49-.5-.66-.5h-.57c-.2 0-.52.07-.8.37s-1.05 1.02-1.05 2.48 1.07 2.88 1.22 3.07c.15.2 2.1 3.2 5.1 4.5 1.78.78 2.48.84 3.37.7.54-.08 1.66-.68 1.9-1.34.23-.66.23-1.22.16-1.34-.07-.13-.27-.2-.57-.35z"
        />
      </svg>
    </a>
  `,
  styles: [
    `
      .fab {
        position: fixed;
        right: 1.25rem;
        bottom: 1.25rem;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: #25d366;
        color: #fff;
        display: grid;
        place-items: center;
        box-shadow: 0 10px 28px rgba(37, 211, 102, 0.45);
        z-index: 90;
        transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease;
        animation: cs-pulse-ring 2.4s ease-out infinite;
      }
      .fab::before {
        content: '';
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid rgba(37, 211, 102, 0.4);
        animation: cs-fab-ring 2.4s ease-out infinite;
      }
      .fab:hover {
        transform: scale(1.08) rotate(-4deg);
        box-shadow: 0 14px 32px rgba(37, 211, 102, 0.55);
      }
      .fab svg { position: relative; z-index: 1; }
      @keyframes cs-fab-ring {
        0%   { transform: scale(1);   opacity: 0.6; }
        70%  { transform: scale(1.35); opacity: 0; }
        100% { transform: scale(1.35); opacity: 0; }
      }
      @media (max-width: 768px) {
        .fab { right: 0.85rem; bottom: 0.85rem; }
      }
      @media (prefers-reduced-motion: reduce) {
        .fab, .fab::before { animation: none; }
      }
    `,
  ],
})
export class WhatsappFabComponent {
  readonly link = `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(
    'Hi, I would like an enquiry about civil supplies.',
  )}`;
}

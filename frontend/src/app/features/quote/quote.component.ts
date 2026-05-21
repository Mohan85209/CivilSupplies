import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

const MAX_BOQ_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'image/jpeg', 'image/png'];

@Component({
  selector: 'cs-quote',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatStepperModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css'],
})
export class QuoteComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly notify = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);

  readonly timelines = ['Within 1 week', 'Within 2 weeks', '1 month', '2–3 months', 'Flexible'];

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+0-9 \-()]{7,20}$/)]],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly projectForm = this.fb.nonNullable.group({
    siteLocation: ['', Validators.required],
    timeline: ['', Validators.required],
    projectDetails: ['', [Validators.required, Validators.minLength(20)]],
  });

  readonly boqFile = signal<File | null>(null);
  readonly fileError = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly submitting = signal(false);

  constructor() {
    const productSlug = this.route.snapshot.queryParamMap.get('product');
    if (productSlug) {
      this.projectForm.patchValue({
        projectDetails: `Interested in product: ${productSlug}.\n\n`,
      });
    }
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileError.set(null);

    if (!file) {
      this.boqFile.set(null);
      return;
    }
    if (file.size > MAX_BOQ_BYTES) {
      this.fileError.set('File is too large. Maximum size is 10 MB.');
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      this.fileError.set('Unsupported file type. Use PDF, Excel, CSV, or image.');
      return;
    }
    this.boqFile.set(file);
  }

  clearFile(): void {
    this.boqFile.set(null);
    this.fileError.set(null);
  }

  submit(): void {
    if (this.contactForm.invalid || this.projectForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.projectForm.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const payload = { ...this.contactForm.getRawValue(), ...this.projectForm.getRawValue() };
    this.api.submitQuote(payload, this.boqFile() ?? undefined).subscribe({
      next: () => {
        this.submitted.set(true);
        this.notify.success('BOQ received! Our team will revert within 24 hours.');
        this.contactForm.reset({ name: '', phone: '', email: '' });
        this.projectForm.reset({ siteLocation: '', timeline: '', projectDetails: '' });
        this.boqFile.set(null);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }
}

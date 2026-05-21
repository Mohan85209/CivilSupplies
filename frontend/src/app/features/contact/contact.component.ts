import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'cs-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly notify = inject(NotificationService);

  readonly projectTypes = ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Renovation', 'Other'];
  readonly materialOptions = ['Cement', 'TMT Steel', 'Bricks / Blocks', 'Aggregates', 'RMC', 'Chemicals', 'Tools', 'Safety gear'];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+0-9 \-()]{7,20}$/)]],
    email: ['', [Validators.required, Validators.email]],
    city: [''],
    projectType: [''],
    materials: [[] as string[]],
    quantity: [''],
    message: ['', [Validators.maxLength(2000)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    this.api.submitEnquiry(payload).subscribe({
      next: () => {
        this.notify.success('Thanks! Your enquiry was received — we will reach out within one business day.');
        this.form.reset({ name: '', phone: '', email: '', city: '', projectType: '', materials: [], quantity: '', message: '' });
      },
    });
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RevealDirective } from '@shared/directives/reveal.directive';

export interface ComingSoonItem {
  icon: string;
  title: string;
  description: string;
  tag?: string;
}

@Component({
  selector: 'cs-coming-soon',
  standalone: true,
  imports: [CommonModule, MatIconModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css'],
})
export class ComingSoonComponent {
  @Input({ required: true }) heading!: string;
  @Input() subheading: string = '';
  @Input({ required: true }) items: ComingSoonItem[] = [];
  @Input() variant: 'products' | 'services' = 'products';
}

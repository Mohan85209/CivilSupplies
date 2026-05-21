import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ComingSoonComponent, ComingSoonItem } from '@shared/components/coming-soon/coming-soon.component';
import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  selector: 'cs-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ComingSoonComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.css'],
})
export class ServicesPageComponent {
  readonly services = [
    { icon: 'local_shipping', title: 'Material supply & delivery', text: 'Bulk supply of cement, TMT, bricks, aggregates and chemicals with same-day Hyderabad dispatch and statewide reach.' },
    { icon: 'engineering', title: 'Site survey & estimation', text: 'On-site survey, quantity take-off and material estimation for residential, commercial and infrastructure projects.' },
    { icon: 'inventory', title: 'Bulk procurement', text: 'Project-rate procurement for builders and contractors — leverage our vendor network for better pricing.' },
    { icon: 'water_drop', title: 'RMC & concrete pumping', text: 'Ready-mix concrete supply with boom and line pumping crews for large pours and high-rise sites.' },
    { icon: 'precision_manufacturing', title: 'Equipment rental', text: 'Concrete mixers, vibrators, scaffolding, surveying instruments and safety gear on flexible rental terms.' },
    { icon: 'support_agent', title: 'Technical consultation', text: 'Mix design guidance, material substitution, and compliance advice from experienced civil engineers.' },
    { icon: 'workspaces', title: 'Project material planning', text: 'End-to-end planning of phase-wise material flow synced to your construction milestones.' },
  ];

  readonly upcomingServices: ComingSoonItem[] = [
    { icon: 'design_services', title: 'Architecture & BIM coordination', description: 'BIM modelling, MEP coordination, and clash-detection services with partner architects.', tag: 'Pilot' },
    { icon: 'fact_check', title: 'Quality audits & MTC verification', description: 'Independent third-party material testing and certificate authentication for critical projects.', tag: 'Beta' },
    { icon: 'agriculture', title: 'Earthwork & site grading', description: 'Excavation, levelling, and site preparation with our equipment-partner network.', tag: 'Q4 launch' },
    { icon: 'eco', title: 'Sustainable construction advisory', description: 'GRIHA / IGBC compliance guidance, green-cement substitution, and recycled-aggregate sourcing.', tag: 'New' },
  ];
}

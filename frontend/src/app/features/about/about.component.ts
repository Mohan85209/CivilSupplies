import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cs-about',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  readonly values = [
    { icon: 'verified', title: 'Quality first', text: 'Authorised channels and material test certificates with every dispatch.' },
    { icon: 'speed', title: 'Speed of execution', text: 'Same-day dispatch and a 24-hour quote SLA so your project never waits on us.' },
    { icon: 'handshake', title: 'Transparent pricing', text: 'No hidden margins — bulk discounts shown on every BOQ quote we send.' },
    { icon: 'eco', title: 'Sustainable supply', text: 'Increasing share of fly-ash blended cement and recycled aggregates wherever possible.' },
  ];

  readonly milestones = [
    { year: '2015', title: 'Founded in Hyderabad', text: 'Started as a single-truck cement & TMT supplier serving local contractors.' },
    { year: '2018', title: 'Expanded to RMC', text: 'Added ready-mix concrete supply and pumping services to our offering.' },
    { year: '2021', title: 'Statewide network', text: 'Reach extended across Telangana and Andhra Pradesh with delivery partners.' },
    { year: '2024', title: '500+ projects', text: 'Crossed half a thousand projects supplied — from villas to commercial towers.' },
  ];

  readonly certifications = ['ISO 9001:2015 (in progress)', 'GST registered', 'MSME registered', 'Authorised UltraTech dealer'];
}

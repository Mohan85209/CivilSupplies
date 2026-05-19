import {
  Truck,
  ClipboardList,
  Package,
  Wrench,
  Hammer,
  Hardhat,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const SERVICES: Service[] = [
  {
    slug: "material-supply-delivery",
    title: "Material Supply & Delivery",
    description: "Site-direct delivery of cement, steel, aggregates and more across Telangana & Andhra Pradesh.",
    icon: Truck,
  },
  {
    slug: "site-survey-estimation",
    title: "Site Survey & Estimation",
    description: "On-site survey and detailed BOQ estimation so you order exactly what your project needs.",
    icon: ClipboardList,
  },
  {
    slug: "bulk-procurement",
    title: "Bulk Procurement",
    description: "Project-scale procurement with negotiated pricing, scheduled deliveries, and brand consistency.",
    icon: Package,
  },
  {
    slug: "rmc-pumping",
    title: "RMC & Pumping",
    description: "Ready-mix concrete supply with on-site pumping arrangements for slabs and large pours.",
    icon: Hammer,
  },
  {
    slug: "equipment-rental",
    title: "Equipment Rental",
    description: "Compactors, mixers, vibrators and safety gear available on daily or project rental.",
    icon: Wrench,
  },
  {
    slug: "technical-consultation",
    title: "Technical Consultation",
    description: "Material specification advice from experienced civil engineers — get the right grade, every time.",
    icon: Hardhat,
  },
  {
    slug: "project-material-planning",
    title: "Project Material Planning",
    description: "End-to-end material plan tied to your construction schedule and cash-flow.",
    icon: LineChart,
  },
];

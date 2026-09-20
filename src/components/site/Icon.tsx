import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Code,
  Compass,
  GraduationCap,
  HeartHandshake,
  Languages,
  Laptop,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Code,
  Compass,
  GraduationCap,
  HeartHandshake,
  Languages,
  Laptop,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = map[name] ?? Sparkles;
  return <Cmp className={className} />;
}

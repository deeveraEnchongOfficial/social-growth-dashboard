import {
  LayoutDashboard,
  BarChart3,
  PenLine,
  Repeat2,
  Clapperboard,
  ImagePlus,
  Library,
  BrainCircuit,
  UserSearch,
  Mail,
  Send,
  ClipboardCheck,
  Settings,
  Gauge,
  Layers,
  ClipboardList,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  PenLine,
  Repeat2,
  Clapperboard,
  ImagePlus,
  Library,
  BrainCircuit,
  UserSearch,
  Mail,
  Send,
  ClipboardCheck,
  Settings,
  Gauge,
  Layers,
  ClipboardList,
  MessageSquare,
};

export function getIcon(name: string): LucideIcon {
  return map[name] ?? LayoutDashboard;
}

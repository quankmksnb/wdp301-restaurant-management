import { MapPin, Package, Phone } from "lucide-react";

export default function KitchenFooter() {
  return (
    <footer className="h-8 bg-[#003d7a] border-t border-white/10 text-white/80 text-[11px] flex items-center justify-center gap-4">
      <span className="flex items-center gap-1.5">
        <Package size={12} />
        v1.0.0
      </span>

      <span className="opacity-40">|</span>

      <span className="flex items-center gap-1.5">
        <Phone size={12} />
        Hỗ trợ 1900 6522
      </span>

      <span className="opacity-40">|</span>

      <span className="flex items-center gap-1.5">
        <MapPin size={12} />
        Chi nhánh trung tâm
      </span>
    </footer>
  );
}

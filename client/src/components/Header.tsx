import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

interface HeaderProps {
  onCtaClick: () => void;
}

export default function Header({ onCtaClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-grey/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/manus-storage/logo_cropped_078d6d4b.png" 
            alt="ED Rent & Sale Logo" 
            className="h-14 md:h-16 w-auto object-contain"
          />
        </div>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-6">
          <a
            href="tel:+4921758845535"
            className="hidden sm:flex items-center gap-2 font-sans text-sm font-bold text-brand-navy hover:text-brand-cyan transition-colors"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
              <Phone className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-brand-grey font-normal">Direkt-Durchwahl</span>
              <span className="text-brand-navy">+49 217 58845535</span>
            </div>
          </a>

          <Button
            onClick={onCtaClick}
            className="bg-brand-cyan text-brand-navy hover:bg-brand-cyan/90 font-bold text-sm px-6 py-5 rounded-xl shadow-lg shadow-brand-cyan/10 hover:shadow-brand-cyan/20 transition-all active:scale-97 flex items-center gap-2"
          >
            <span>Fahrzeug anfragen</span>
            <ArrowRight className="h-4 w-4 text-brand-navy" />
          </Button>
        </div>
      </div>
    </header>
  );
}

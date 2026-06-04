import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

interface HeaderProps {
  onCtaClick: () => void;
}

export default function Header({ onCtaClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-muted/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center bg-primary text-accent font-display font-bold text-xl rounded-sm">
            ED
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg tracking-tight text-primary leading-none">
              ED RENT & SALE
            </span>
            <span className="font-sans text-xs font-semibold tracking-wider text-muted uppercase mt-0.5">
              Nutzfahrzeuge
            </span>
          </div>
        </div>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-6">
          <a
            href="tel:+498001234567"
            className="hidden sm:flex items-center gap-2 font-sans text-sm font-bold text-primary hover:text-accent transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-secondary text-primary">
              <Phone className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted font-normal">Kostenfreie Beratung</span>
              <span>+49 (0) 800 123 4567</span>
            </div>
          </a>

          <Button
            onClick={onCtaClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-bold px-6 py-5 rounded-sm shadow-sm transition-all duration-150 active:scale-95 flex items-center gap-2"
          >
            <span>Fahrzeug anfragen</span>
            <ArrowRight className="h-4 w-4 text-accent" />
          </Button>
        </div>
      </div>
    </header>
  );
}

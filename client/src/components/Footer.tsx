import { Link } from "wouter";

interface FooterProps {
  onScrollToTop?: () => void;
}

export default function Footer({ onScrollToTop }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-navy text-white py-16 border-t border-brand-navy/20">
      {/* Mini Tech-Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
                    {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center">
              <img 
                src="/manus-storage/logo_cropped_078d6d4b.png" 
                alt="ED Rent & Sale Logo" 
                className="h-16 md:h-20 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="font-sans text-xs text-white/70 max-w-sm leading-relaxed">
              Ihr spezialisierter B2B-Partner für hochwertige Nutzfahrzeuge. Kauf, Leasing, Sonderaufbauten und Finanzierung aus einer Hand.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase">
              Kontakt
            </h4>
            <ul className="font-sans text-xs text-white/70 space-y-2">
              <li>ED Rent and Sale</li>
              <li>Bremsen 13 A</li>
              <li>42799 Leichlingen (Rheinland)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase">
              Direktkontakt
            </h4>
            <ul className="font-sans text-xs text-white/70 space-y-2">
              <li>
                <span className="font-semibold text-white">Tel:</span>{" "}
                <a href="tel:+4921758845535" className="hover:text-brand-cyan transition-colors">
                  +49 2175 8845535
                </a>
              </li>
              <li>
                <span className="font-semibold text-white">E-Mail:</span>{" "}
                <a href="mailto:info@ed-rent.com" className="hover:text-brand-cyan transition-colors">
                  info@ed-rent.com
                </a>
              </li>
              <li>
                <span className="font-semibold text-white">Bürozeiten:</span> Mo. - Fr. 08:00 - 18:00 Uhr
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[10px] text-white/50 uppercase tracking-wider">
          <div>
            © {currentYear} ED Rent and Sale. Alle Rechte vorbehalten.
          </div>
          <div className="flex gap-6">
            <Link href="/impressum" onClick={onScrollToTop} className="hover:text-brand-cyan transition-colors">Impressum</Link>
            <Link href="/datenschutz" onClick={onScrollToTop} className="hover:text-brand-cyan transition-colors">Datenschutz</Link>
            <a href="#" className="hover:text-brand-cyan transition-colors">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

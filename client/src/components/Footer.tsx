export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-primary-foreground/10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center bg-background text-primary font-display font-bold text-lg rounded-sm">
                ED
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-primary-foreground">
                ED RENT & SALE
              </span>
            </div>
            <p className="font-sans text-xs text-primary-foreground/70 max-w-sm leading-relaxed">
              Ihr spezialisierter B2B-Partner für hochwertige Nutzfahrzeuge, Kastenwagen, Sprinter und LKW. Zuverlässige Beratung, maßgeschneiderte Sonderaufbauten und starke Finanzierungskonditionen.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-sm text-accent tracking-wider uppercase">
              Kontakt
            </h4>
            <ul className="font-sans text-xs text-primary-foreground/70 space-y-2">
              <li>ED Rent & Sale GmbH</li>
              <li>Nutzfahrzeugzentrum West</li>
              <li>Industriestraße 45</li>
              <li>40210 Düsseldorf</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display font-bold text-sm text-accent tracking-wider uppercase">
              Direktkontakt
            </h4>
            <ul className="font-sans text-xs text-primary-foreground/70 space-y-2">
              <li>
                <span className="font-semibold text-primary-foreground">Tel:</span>{" "}
                <a href="tel:+498001234567" className="hover:text-accent transition-colors">
                  +49 (0) 800 123 4567
                </a>
              </li>
              <li>
                <span className="font-semibold text-primary-foreground">E-Mail:</span>{" "}
                <a href="mailto:info@ed-rent-sale.de" className="hover:text-accent transition-colors">
                  info@ed-rent-sale.de
                </a>
              </li>
              <li>
                <span className="font-semibold text-primary-foreground">Bürozeiten:</span> Mo. - Fr. 08:00 - 18:00 Uhr
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[10px] text-primary-foreground/50 uppercase tracking-wider">
          <div>
            © {currentYear} ED Rent & Sale GmbH. Alle Rechte vorbehalten.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">Impressum</a>
            <a href="#" className="hover:text-accent transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-accent transition-colors">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

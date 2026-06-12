import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowLeft, Building2, User, Phone, Mail, FileText, Scale } from "lucide-react";
import { useEffect } from "react";

export default function Impressum() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCtaClick = () => {
    window.location.href = "/#anfrage";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onCtaClick={handleCtaClick} />

      <main className="flex-grow py-16 lg:py-24">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 font-sans text-sm font-bold text-primary hover:text-accent transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Zurück zur Startseite</span>
            </Link>
          </div>

          {/* Page Title */}
          <div className="space-y-4 mb-12 border-b border-muted/20 pb-8">
            <h1 className="font-display font-extrabold text-4xl tracking-tight text-primary sm:text-5xl">
              Impressum
            </h1>
            <p className="font-sans text-base text-muted">
              Gesetzliche Anbieterkennzeichnung nach § 5 DDG (ehemals TMG)
            </p>
          </div>

          {/* Impressum Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Card 1: Anbieter & Vertretung */}
            <div className="border border-muted/20 p-6 rounded-sm bg-secondary/10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Building2 className="h-5 w-5 text-accent" />
                <h2 className="font-display font-bold text-lg">Angaben gemäß § 5 DDG</h2>
              </div>
              <div className="font-sans text-sm text-primary space-y-2 leading-relaxed">
                <p className="font-bold">ED Rent and Sale</p>
                <p>Bremsen 13 A</p>
                <p>42799 Leichlingen (Rheinland)</p>
                <p>Deutschland</p>
              </div>
            </div>

            {/* Card 2: Vertreten durch */}
            <div className="border border-muted/20 p-6 rounded-sm bg-secondary/10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <User className="h-5 w-5 text-accent" />
                <h2 className="font-display font-bold text-lg">Vertreten durch</h2>
              </div>
              <div className="font-sans text-sm text-primary space-y-2 leading-relaxed">
                <p className="font-semibold">Geschäftsführer:</p>
                <p>Enes Dilekci</p>
              </div>
            </div>

            {/* Card 3: Kontakt */}
            <div className="border border-muted/20 p-6 rounded-sm bg-secondary/10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Phone className="h-5 w-5 text-accent" />
                <h2 className="font-display font-bold text-lg">Kontakt</h2>
              </div>
              <div className="font-sans text-sm text-primary space-y-2 leading-relaxed">
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Telefon:</span>
                  <a href="tel:+4921758845535" className="hover:text-accent transition-colors">+49 2175 8845535</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">E-Mail:</span>
                  <a href="mailto:info@ed-rent.com" className="hover:text-accent transition-colors">info@ed-rent.com</a>
                </p>
              </div>
            </div>

            {/* Card 4: Register & Steuer-ID */}
            <div className="border border-muted/20 p-6 rounded-sm bg-secondary/10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <FileText className="h-5 w-5 text-accent" />
                <h2 className="font-display font-bold text-lg">Umsatzsteuer-ID</h2>
              </div>
              <div className="font-sans text-sm text-primary space-y-2 leading-relaxed">
                <p className="font-semibold">Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                <p className="font-mono text-xs tracking-wider bg-secondary/30 px-2 py-1 rounded-sm inline-block">DE 33598989106</p>
              </div>
            </div>

          </div>

          {/* Legal Disclaimer / EU Dispute Resolution */}
          <div className="border border-muted/20 p-8 rounded-sm bg-secondary/5 space-y-6">
            <div className="flex items-center gap-3 text-primary border-b border-muted/20 pb-4">
              <Scale className="h-5 w-5 text-accent" />
              <h2 className="font-display font-bold text-xl">Streitbeilegung</h2>
            </div>
            
            <div className="font-sans text-sm text-muted space-y-4 leading-relaxed">
              <h3 className="font-bold text-primary">EU-Streitbeilegung</h3>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent font-semibold underline decoration-accent/50 underline-offset-4">
                  https://ec.europa.eu/consumers/odr/
                </a>.
              </p>
              <p>
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>

              <h3 className="font-bold text-primary mt-6">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h3>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer onScrollToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
    </div>
  );
}

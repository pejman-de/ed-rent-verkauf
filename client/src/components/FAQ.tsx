import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "Welche Finanzierungs- und Leasingmöglichkeiten bieten Sie an?",
      a: "Wir arbeiten eng mit renommierten B2B-Finanzierungspartnern wie der GEFA Bank zusammen. Dadurch können wir Ihnen maßgeschneiderte Finanzierungslösungen wie klassisches Leasing, Mietkauf oder Ratenzahlung anbieten – perfekt abgestimmt auf die steuerlichen und betriebswirtschaftlichen Anforderungen Ihres Unternehmens."
    },
    {
      q: "Sind individuelle Sonderaufbauten (z.B. Koffer, Pritsche, Plane) möglich?",
      a: "Ja, absolut. Sonderaufbauten sind eine unserer Kernkompetenzen. Ob Kofferaufbau, Pritsche mit Plane, Kühlkoffer oder spezielle Regaleinbauten für Handwerksbetriebe – wir planen und realisieren Ihren Aufbau exakt nach Ihren Vorgaben direkt ab Werk oder über zertifizierte Aufbaupartner."
    },
    {
      q: "Wie läuft die Lieferung oder Abholung ab?",
      a: "Sie haben die Wahl: Entweder holen Sie Ihr neues Nutzfahrzeug direkt an unserem zentralen Ausstellungsstandort ab, oder wir liefern es bundesweit gegen eine faire Pauschale direkt an Ihren Wunschort oder Betriebshof. Die Übergabe erfolgt stets inklusive einer professionellen Einweisung."
    },
    {
      q: "Welche Garantien erhalte ich beim Kauf eines Gebrauchtfahrzeugs?",
      a: "Sicherheit steht bei uns an erster Stelle. Jedes gebrauchte Nutzfahrzeug durchläuft vor dem Verkauf unseren strengen 120-Punkte-Werkstattcheck. Sie erhalten das Fahrzeug mit frischer Haupt- und Abgasuntersuchung (TÜV) sowie einer speziellen B2B-Gebrauchtwagengarantie, die Sie vor unerwarteten Reparaturkosten schützt."
    }
  ];

  return (
    <section className="bg-secondary/30 py-16 lg:py-24 border-b border-muted/10">
      <div className="container max-w-3xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="font-sans text-xs font-bold tracking-wider text-muted uppercase">
            Häufig gestellte Fragen
          </span>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Fragen & Antworten
          </h2>
          <p className="font-sans text-base text-muted leading-relaxed">
            Hier finden Sie schnelle Antworten auf die wichtigsten Fragen rund um den Fahrzeugkauf, Sonderaufbauten und Finanzierung bei ED Rent & Sale.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-muted/20 bg-background px-6 py-2 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
            >
              <AccordionTrigger className="font-display font-bold text-base text-primary hover:text-accent hover:no-underline text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-sm text-muted leading-relaxed pt-2 border-t border-muted/10 mt-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

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
      a: "Wir finanzieren passgenau über unseren Partner GEFA Bank. Ob Leasing, Mietkauf oder klassische Finanzierung, wir finden die für Ihren Betrieb wirtschaftlichste Lösung."
    },
    {
      q: "Sind individuelle Sonderaufbauten (z.B. Koffer, Pritsche, Plane) möglich?",
      a: "Ja. Wir realisieren Ihren Wunschaufbau exakt nach Vorgabe, vom Standard-Koffer bis zur Branchenlösung."
    },
    {
      q: "Wie läuft die Lieferung oder Abholung ab?",
      a: "Sie haben die Wahl. Holen Sie Ihr Fahrzeug an unserem Standort ab oder lassen Sie es termingerecht direkt zu Ihrem Betriebshof liefern."
    },
    {
      q: "Welche Garantien erhalte ich beim Kauf eines Gebrauchtfahrzeugs?",
      a: "Jeder Gebrauchte durchläuft unseren 120-Punkte-Check und kommt mit frischem TÜV sowie Gewährleistung. So fahren Sie ohne böse Überraschungen los."
    }
  ];

  return (
    <section className="relative overflow-hidden bg-brand-light py-20 border-b border-brand-grey/10">
      {/* Tech-Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6e7c950a_1px,transparent_1px),linear-gradient(to_bottom,#6e7c950a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="container relative z-10 max-w-3xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-cyan">
            Häufig gestellte Fragen
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
            Fragen & Antworten
          </h2>
          <p className="font-sans text-base text-brand-grey leading-relaxed">
            Hier finden Sie schnelle Antworten auf die wichtigsten Fragen rund um den Fahrzeugkauf, Sonderaufbauten und die Finanzierung bei ED Rent & Sale.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-brand-grey/15 bg-white px-6 py-2 rounded-2xl shadow-sm hover:border-brand-cyan/40 transition-all duration-300"
            >
              <AccordionTrigger className="font-display font-bold text-base text-brand-navy hover:text-brand-cyan hover:no-underline text-left cursor-pointer">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-sm text-brand-grey leading-relaxed pt-2 border-t border-brand-grey/10 mt-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

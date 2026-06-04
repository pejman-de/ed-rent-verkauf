import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VEHICLES, Vehicle } from "@shared/const";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Scale, Info, CheckCircle2 } from "lucide-react";

interface InteractiveGalleryProps {
  onInquireClick: (vehicleName: string) => void;
}

export default function InteractiveGallery({ onInquireClick }: InteractiveGalleryProps) {
  // Filter States
  const [condition, setCondition] = useState<'Neu' | 'Gebraucht'>('Neu');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSpec, setSelectedSpec] = useState<string>('all');

  // Filter options derived from data
  const types = useMemo(() => {
    const allTypes = VEHICLES.map(v => v.type);
    return ['all', ...Array.from(new Set(allTypes))];
  }, []);

  const brands = useMemo(() => {
    const allBrands = VEHICLES.map(v => v.brand);
    return ['all', ...Array.from(new Set(allBrands))];
  }, []);

  const specs = ['all', 'high-power', 'high-payload', 'high-volume'];

  // Filter Logic
  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter((vehicle) => {
      // 1. Condition Filter (Neu / Gebraucht)
      if (vehicle.condition !== condition) return false;

      // 2. Type Filter
      if (selectedType !== 'all' && vehicle.type !== selectedType) return false;

      // 3. Brand Filter
      if (selectedBrand !== 'all' && vehicle.brand !== selectedBrand) return false;

      // 4. Special Spec Filter
      if (selectedSpec !== 'all') {
        const powerNum = parseInt(vehicle.specs.power);
        const payloadNum = parseInt(vehicle.specs.payload.replace('.', '').replace(' kg', ''));
        const volumeNum = parseFloat(vehicle.specs.volume.replace(',', '.'));

        if (selectedSpec === 'high-power' && powerNum < 160) return false;
        if (selectedSpec === 'high-payload' && payloadNum < 1250) return false;
        if (selectedSpec === 'high-volume' && volumeNum < 12) return false;
      }

      return true;
    });
  }, [condition, selectedType, selectedBrand, selectedSpec]);

  // Reset Filters helper
  const resetFilters = () => {
    setSelectedType('all');
    setSelectedBrand('all');
    setSelectedSpec('all');
  };

  return (
    <section id="gallery" className="bg-background py-16 lg:py-24 border-b border-muted/10">
      <div className="container space-y-12">
        
        {/* Section Header & Filters Row */}
        <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:items-end lg:justify-between border-b border-muted/20 pb-8">
          
          {/* Left: Tab Switcher (Neu / Gebraucht) */}
          <div className="space-y-4">
            <span className="font-sans text-xs font-bold tracking-wider text-muted uppercase">
              Aktueller Fahrzeugbestand
            </span>
            <div className="inline-flex p-1 bg-secondary border border-muted/20 rounded-sm">
              <button
                onClick={() => { setCondition('Neu'); resetFilters(); }}
                className={`px-6 py-2.5 font-display font-bold text-sm rounded-sm transition-all duration-150 ${
                  condition === 'Neu'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted hover:text-primary'
                }`}
              >
                Neufahrzeuge
              </button>
              <button
                onClick={() => { setCondition('Gebraucht'); resetFilters(); }}
                className={`px-6 py-2.5 font-display font-bold text-sm rounded-sm transition-all duration-150 ${
                  condition === 'Gebraucht'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted hover:text-primary'
                }`}
              >
                Gebrauchtfahrzeuge
              </button>
            </div>
          </div>

          {/* Right: 3 Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:max-w-2xl">
            {/* Filter 1: Typ */}
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-bold text-muted uppercase tracking-wider">Fahrzeugtyp</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary">
                  <SelectValue placeholder="Alle Typen" />
                </SelectTrigger>
                <SelectContent className="bg-background border-muted/20 rounded-sm">
                  <SelectItem value="all" className="text-xs font-medium text-primary">Alle Typen</SelectItem>
                  {types.filter(t => t !== 'all').map(type => (
                    <SelectItem key={type} value={type} className="text-xs font-medium text-primary">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter 2: Marke */}
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-bold text-muted uppercase tracking-wider">Marke</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary">
                  <SelectValue placeholder="Alle Marken" />
                </SelectTrigger>
                <SelectContent className="bg-background border-muted/20 rounded-sm">
                  <SelectItem value="all" className="text-xs font-medium text-primary">Alle Marken</SelectItem>
                  {brands.filter(b => b !== 'all').map(brand => (
                    <SelectItem key={brand} value={brand} className="text-xs font-medium text-primary">
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter 3: Aufbau / Leistung */}
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-bold text-muted uppercase tracking-wider">Spezifikation</label>
              <Select value={selectedSpec} onValueChange={setSelectedSpec}>
                <SelectTrigger className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary">
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent className="bg-background border-muted/20 rounded-sm">
                  <SelectItem value="all" className="text-xs font-medium text-primary">Standard (Alle)</SelectItem>
                  <SelectItem value="high-power" className="text-xs font-medium text-primary">Starke Leistung (&ge; 160 PS)</SelectItem>
                  <SelectItem value="high-payload" className="text-xs font-medium text-primary">Hohe Zuladung (&ge; 1.250 kg)</SelectItem>
                  <SelectItem value="high-volume" className="text-xs font-medium text-primary">Großes Volumen (&ge; 12 m³)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>

        {/* Gallery Grid with Framer Motion AnimatePresence */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredVehicles.map((vehicle) => (
              <motion.div
                layout
                key={vehicle.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col border border-muted/20 bg-background rounded-sm overflow-hidden hover:border-muted/40 hover:shadow-md transition-all duration-200 group"
              >
                {/* Vehicle Image Placeholder */}
                <div className="aspect-[4/3] relative overflow-hidden bg-secondary">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Availability Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-primary-foreground font-sans font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 border border-primary-foreground/10 rounded-sm flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      {vehicle.availability}
                    </Badge>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col p-6 flex-grow space-y-5">
                  <div className="space-y-1">
                    <span className="font-sans text-[10px] font-bold text-muted tracking-wider uppercase">
                      {vehicle.brand} • {vehicle.type}
                    </span>
                    <h3 className="font-display font-bold text-lg text-primary leading-snug group-hover:text-accent transition-colors">
                      {vehicle.name}
                    </h3>
                  </div>

                  {/* Technical Specs Table-style Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-b border-muted/10 py-4 font-sans text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted font-medium">Leistung:</span>
                      <span className="text-primary font-bold">{vehicle.specs.power}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted font-medium">Getriebe:</span>
                      <span className="text-primary font-bold truncate max-w-[80px]" title={vehicle.specs.gearbox}>
                        {vehicle.specs.gearbox}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted font-medium">Zuladung:</span>
                      <span className="text-primary font-bold">{vehicle.specs.payload}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted font-medium">Laderaum:</span>
                      <span className="text-primary font-bold">{vehicle.specs.volume}</span>
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      <span className="font-sans text-[10px] font-semibold text-muted uppercase tracking-wider">
                        Gewerblicher Kaufpreis
                      </span>
                      <span className="font-display font-extrabold text-xl text-primary">
                        {vehicle.price}
                      </span>
                      <span className="font-sans text-[9px] text-muted font-medium mt-0.5">
                        zzgl. MwSt. • Leasing ab Werk
                      </span>
                    </div>

                    <Button
                      onClick={() => onInquireClick(vehicle.name)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-bold text-xs px-4 py-4 rounded-sm transition-all duration-150 active:scale-95 flex items-center gap-1.5"
                    >
                      <span>Anfragen</span>
                      <ArrowRight className="h-3.5 w-3.5 text-accent" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State when filters yield no results */}
          {filteredVehicles.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-muted/30 rounded-sm bg-secondary/10 space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted">
                <Info className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-primary">Keine passenden Fahrzeuge gefunden</h4>
                <p className="font-sans text-sm text-muted max-w-md mx-auto">
                  Für Ihre gewählten Filtereinstellungen sind aktuell keine Fahrzeuge im direkten Bestand. Gerne beschaffen wir Ihr Wunschfahrzeug kurzfristig.
                </p>
              </div>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="font-sans font-bold text-xs border-primary text-primary rounded-sm"
              >
                Filter zurücksetzen
              </Button>
            </div>
          )}
        </motion.div>

        {/* Dynamic CTA Banner below the Grid */}
        <div className="border border-muted/20 bg-secondary/30 p-6 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary text-accent mt-0.5">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-primary">Ihr Wunschfahrzeug ist nicht dabei?</h4>
              <p className="font-sans text-xs text-muted max-w-xl leading-relaxed">
                Über unser Händlerübergreifendes B2B-Netzwerk haben wir Zugriff auf über 1.000 weitere verfügbare Nutzfahrzeuge. Sagen Sie uns einfach, was Sie suchen.
              </p>
            </div>
          </div>
          <Button
            onClick={() => onInquireClick("Individuelle Spezifikation")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-bold text-xs px-6 py-5 rounded-sm shrink-0 shadow-sm transition-all duration-150 active:scale-95"
          >
            Individuelles Fahrzeug anfragen
          </Button>
        </div>

      </div>
    </section>
  );
}

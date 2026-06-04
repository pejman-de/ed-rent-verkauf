import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle2, ShieldCheck } from "lucide-react";

// 1. Define Zod Validation Schema with conditional logic for Stückzahl
const formSchema = z.object({
  lead_path: z.enum(["einzel", "paket"]),
  fahrzeugtyp: z.string().min(1, "Bitte wählen Sie einen Fahrzeugtyp."),
  condition: z.enum(["Neu", "Gebraucht"]),
  abholung_lieferung: z.enum(["Abholung", "Lieferung"]),
  wunschtermin: z.string().min(1, "Bitte wählen Sie einen Wunschtermin."),
  einsatzregion: z.string().min(5, "Bitte geben Sie eine gültige PLZ oder Region ein."),
  stueckzahl: z.number().int().min(1, "Mindestens 1 Fahrzeug."),
  firma: z.string().min(2, "Bitte geben Sie Ihren Firmennamen ein."),
  ansprechpartner: z.string().min(2, "Bitte geben Sie den Namen des Ansprechpartners ein."),
  telefon: z.string().min(6, "Bitte geben Sie eine gültige Telefonnummer ein."),
  finanzierung: z.enum(["Ja", "Nein"]),
  aufbau: z.enum(["Ja", "Nein"]),
  // Hidden fields state
  offer_type: z.string(),
  page_variant: z.string(),
}).superRefine((data, ctx) => {
  // Conditional validation: If lead_path is "paket", stueckzahl must be at least 10
  if (data.lead_path === "paket" && data.stueckzahl < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Als Händler / Paketabnehmer müssen Sie mindestens 10 Fahrzeuge anfragen.",
      path: ["stueckzahl"],
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

interface LeadFormProps {
  prefilledVehicle?: string;
}

export default function LeadForm({ prefilledVehicle }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<"Hot" | "Warm" | "Cold" | null>(null);

  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lead_path: "einzel",
      fahrzeugtyp: prefilledVehicle || "",
      condition: "Neu",
      abholung_lieferung: "Abholung",
      wunschtermin: "",
      einsatzregion: "",
      stueckzahl: 1,
      firma: "",
      ansprechpartner: "",
      telefon: "",
      finanzierung: "Nein",
      aufbau: "Nein",
      offer_type: "verkauf",
      page_variant: "lp-verkauf",
    },
  });

  // Watch lead_path and stueckzahl to adjust default stueckzahl value dynamically
  const watchLeadPath = watch("lead_path");
  const watchStueckzahl = watch("stueckzahl");
  const watchFahrzeugtyp = watch("fahrzeugtyp");

  // Update fahrzeugtyp when prefilledVehicle prop changes
  useEffect(() => {
    if (prefilledVehicle) {
      setValue("fahrzeugtyp", prefilledVehicle);
    }
  }, [prefilledVehicle, setValue]);

  // Adjust Stückzahl default based on lead path selection
  useEffect(() => {
    if (watchLeadPath === "paket" && watchStueckzahl < 10) {
      setValue("stueckzahl", 10);
    } else if (watchLeadPath === "einzel" && watchStueckzahl >= 10) {
      setValue("stueckzahl", 1);
    }
  }, [watchLeadPath, setValue]);

  // 3. Lead-Scoring Algorithm (Submit Handler)
  const calculateLeadScore = (data: FormValues): "Hot" | "Warm" | "Cold" => {
    try {
      const today = new Date();
      const targetDate = new Date(data.wunschtermin);
      
      // Calculate difference in days
      const diffTime = Math.abs(targetDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Rule 1: Score A (Hot)
      // IF (lead_path == "paket" AND Stückzahl >= 10) OR (Finanzierung gewünscht == "Ja" AND Wunschtermin < 14 days from today)
      if (
        (data.lead_path === "paket" && data.stueckzahl >= 10) ||
        (data.finanzierung === "Ja" && diffDays < 14)
      ) {
        return "Hot";
      }

      // Rule 2: Score B (Warm)
      // IF (lead_path == "einzel" AND Wunschtermin is between 14 and 30 days from today)
      if (
        data.lead_path === "einzel" &&
        diffDays >= 14 &&
        diffDays <= 30
      ) {
        return "Warm";
      }

      // Rule 3: Score C (Cold)
      // No date provided or incomplete payload (fallback)
      return "Cold";
    } catch (e) {
      return "Cold";
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Calculate the score
    const score = calculateLeadScore(data);
    setCalculatedScore(score);

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Console.log payload & lead score exactly as required
    console.log("=== ED Rent & Sale Lead Submission ===");
    console.log("Lead Score Category:", score);
    console.log("Payload:", {
      ...data,
      lead_score: score,
      submitted_at: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Anfrage erfolgreich übermittelt!");
  };

  return (
    <section id="anfrage" className="bg-secondary/30 py-16 lg:py-24 border-b border-muted/10 scroll-mt-20">
      <div className="container max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 border border-muted/30 bg-background px-3 py-1 rounded-sm">
            <span className="font-sans text-xs font-bold tracking-wider text-primary uppercase">
              Direktanfrage
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            Unverbindliches Angebot anfordern
          </h2>
          <p className="font-sans text-base text-muted leading-relaxed">
            Teilen Sie uns Ihre Anforderungen mit. Unser B2B-Team meldet sich innerhalb von 24 Stunden mit einem konkreten Angebot bei Ihnen.
          </p>
        </div>

        {/* Lead Form Container */}
        <div className="bg-background border border-muted/20 rounded-sm shadow-lg overflow-hidden">
          
          {/* Form Header Info Bar */}
          <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between border-b border-muted/20">
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>B2B-Direktanfrage • 100% DSGVO-konform</span>
            </div>
            <span className="text-[10px] font-sans text-primary-foreground/60 hidden sm:inline">
              Bearbeitungszeit: &lt; 24 Std.
            </span>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10 space-y-8">
              
              {/* 1. Top Level Toggle (Radio Group) */}
              <div className="space-y-3">
                <Label className="font-display font-bold text-sm text-primary">Anfrage-Typ</Label>
                <RadioGroup
                  defaultValue="einzel"
                  value={watchLeadPath}
                  onValueChange={(val) => setValue("lead_path", val as "einzel" | "paket")}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className={`flex items-center space-x-3 p-4 border rounded-sm cursor-pointer transition-colors ${
                    watchLeadPath === "einzel"
                      ? "border-primary bg-secondary/30"
                      : "border-muted/20 hover:border-muted/40"
                  }`}>
                    <RadioGroupItem value="einzel" id="r-einzel" className="text-primary border-primary" />
                    <Label htmlFor="r-einzel" className="font-sans font-bold text-sm text-primary cursor-pointer flex flex-col">
                      <span>Einzelkauf</span>
                      <span className="text-xs font-normal text-muted mt-0.5">Bedarf unter 10 Fahrzeugen</span>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-3 p-4 border rounded-sm cursor-pointer transition-colors ${
                    watchLeadPath === "paket"
                      ? "border-primary bg-secondary/30"
                      : "border-muted/20 hover:border-muted/40"
                  }`}>
                    <RadioGroupItem value="paket" id="r-paket" className="text-primary border-primary" />
                    <Label htmlFor="r-paket" className="font-sans font-bold text-sm text-primary cursor-pointer flex flex-col">
                      <span>Händler / Paketabnahme</span>
                      <span className="text-xs font-normal text-muted mt-0.5">Sonderkonditionen ab 10 Fahrzeugen</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 2. Main Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Fahrzeugtyp (Select/Input combo or simple Select) */}
                <div className="space-y-2">
                  <Label htmlFor="fahrzeugtyp" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                    Fahrzeugtyp / Wunschmodell
                  </Label>
                  <Select
                    value={watchFahrzeugtyp}
                    onValueChange={(val) => setValue("fahrzeugtyp", val)}
                  >
                    <SelectTrigger className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary">
                      <SelectValue placeholder="Bitte wählen..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-muted/20 rounded-sm">
                      <SelectItem value="Mercedes-Benz Sprinter 317 CDI" className="text-xs font-medium text-primary">Mercedes-Benz Sprinter 317 CDI</SelectItem>
                      <SelectItem value="Iveco Daily 35S18 Box" className="text-xs font-medium text-primary">Iveco Daily 35S18 Box</SelectItem>
                      <SelectItem value="MAN TGE 3.180 Kasten" className="text-xs font-medium text-primary">MAN TGE 3.180 Kasten</SelectItem>
                      <SelectItem value="Fiat Ducato L3H2" className="text-xs font-medium text-primary">Fiat Ducato L3H2</SelectItem>
                      <SelectItem value="Opel Movano Cargo L2H2" className="text-xs font-medium text-primary">Opel Movano Cargo L2H2</SelectItem>
                      <SelectItem value="Mercedes-Benz Atego 1223" className="text-xs font-medium text-primary">Mercedes-Benz Atego 1223</SelectItem>
                      <SelectItem value="Individuelle Spezifikation" className="text-xs font-medium text-primary">Individuelle Spezifikation / Anderes Modell</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.fahrzeugtyp && (
                    <p className="text-xs font-semibold text-destructive">{errors.fahrzeugtyp.message}</p>
                  )}
                </div>

                {/* Neu / Gebraucht (Select) */}
                <div className="space-y-2">
                  <Label className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                    Zustand
                  </Label>
                  <Select
                    defaultValue="Neu"
                    onValueChange={(val) => setValue("condition", val as "Neu" | "Gebraucht")}
                  >
                    <SelectTrigger className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary">
                      <SelectValue placeholder="Zustand wählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-muted/20 rounded-sm">
                      <SelectItem value="Neu" className="text-xs font-medium text-primary">Neufahrzeug</SelectItem>
                      <SelectItem value="Gebraucht" className="text-xs font-medium text-primary">Gebrauchtfahrzeug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Abholung oder Lieferung (Select) */}
                <div className="space-y-2">
                  <Label className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                    Logistikoption
                  </Label>
                  <Select
                    defaultValue="Abholung"
                    onValueChange={(val) => setValue("abholung_lieferung", val as "Abholung" | "Lieferung")}
                  >
                    <SelectTrigger className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary">
                      <SelectValue placeholder="Logistik wählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-muted/20 rounded-sm">
                      <SelectItem value="Abholung" className="text-xs font-medium text-primary">Selbstabholung (Zentrallager)</SelectItem>
                      <SelectItem value="Lieferung" className="text-xs font-medium text-primary">Bundesweite Lieferung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Wunschtermin (Date) */}
                <div className="space-y-2">
                  <Label htmlFor="wunschtermin" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                    Wunschtermin / Liefertermin
                  </Label>
                  <Input
                    type="date"
                    id="wunschtermin"
                    className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary"
                    {...register("wunschtermin")}
                  />
                  {errors.wunschtermin && (
                    <p className="text-xs font-semibold text-destructive">{errors.wunschtermin.message}</p>
                  )}
                </div>

                {/* Einsatzregion / PLZ (Input) */}
                <div className="space-y-2">
                  <Label htmlFor="einsatzregion" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                    Einsatzregion / PLZ
                  </Label>
                  <Input
                    type="text"
                    id="einsatzregion"
                    placeholder="z.B. 40210 Düsseldorf"
                    className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary"
                    {...register("einsatzregion")}
                  />
                  {errors.einsatzregion && (
                    <p className="text-xs font-semibold text-destructive">{errors.einsatzregion.message}</p>
                  )}
                </div>

                {/* Stückzahl (Input / Number) */}
                <div className="space-y-2">
                  <Label htmlFor="stueckzahl" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                    Stückzahl
                  </Label>
                  <Input
                    type="number"
                    id="stueckzahl"
                    min="1"
                    className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary"
                    {...register("stueckzahl", { valueAsNumber: true })}
                  />
                  {errors.stueckzahl && (
                    <p className="text-xs font-semibold text-destructive">{errors.stueckzahl.message}</p>
                  )}
                </div>

              </div>

              {/* 3. Radio/Boolean Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-muted/10">
                {/* Finanzierung gewünscht? */}
                <div className="space-y-3">
                  <Label className="font-display font-bold text-sm text-primary">Finanzierung / Leasing gewünscht?</Label>
                  <RadioGroup
                    defaultValue="Nein"
                    onValueChange={(val) => setValue("finanzierung", val as "Ja" | "Nein")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ja" id="fin-ja" className="text-primary border-primary" />
                      <Label htmlFor="fin-ja" className="font-sans font-semibold text-sm text-primary cursor-pointer">Ja (z.B. GEFA Bank)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Nein" id="fin-nein" className="text-primary border-primary" />
                      <Label htmlFor="fin-nein" className="font-sans font-semibold text-sm text-primary cursor-pointer">Nein (Kauf)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Aufbau gewünscht? */}
                <div className="space-y-3">
                  <Label className="font-display font-bold text-sm text-primary">Sonderaufbau benötigt?</Label>
                  <RadioGroup
                    defaultValue="Nein"
                    onValueChange={(val) => setValue("aufbau", val as "Ja" | "Nein")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ja" id="auf-ja" className="text-primary border-primary" />
                      <Label htmlFor="auf-ja" className="font-sans font-semibold text-sm text-primary cursor-pointer">Ja (Koffer, Pritsche etc.)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Nein" id="auf-nein" className="text-primary border-primary" />
                      <Label htmlFor="auf-nein" className="font-sans font-semibold text-sm text-primary cursor-pointer">Nein (Kasten/Standard)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* 4. Company & Contact Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-muted/10">
                {/* Firma */}
                <div className="space-y-2">
                  <Label htmlFor="firma" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                    Firma
                  </Label>
                  <Input
                    type="text"
                    id="firma"
                    placeholder="Firmenname GmbH"
                    className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary"
                    {...register("firma")}
                  />
                  {errors.firma && (
                    <p className="text-xs font-semibold text-destructive">{errors.firma.message}</p>
                  )}
                </div>

                {/* Ansprechpartner */}
                <div className="space-y-2">
                  <Label htmlFor="ansprechpartner" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                    Ansprechpartner
                  </Label>
                  <Input
                    type="text"
                    id="ansprechpartner"
                    placeholder="Max Mustermann"
                    className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary"
                    {...register("ansprechpartner")}
                  />
                  {errors.ansprechpartner && (
                    <p className="text-xs font-semibold text-destructive">{errors.ansprechpartner.message}</p>
                  )}
                </div>

                {/* Telefon */}
                <div className="space-y-2">
                  <Label htmlFor="telefon" className="font-sans font-bold text-xs text-primary uppercase tracking-wider">
                    Telefonnummer
                  </Label>
                  <Input
                    type="tel"
                    id="telefon"
                    placeholder="+49 (0) 123 456789"
                    className="w-full bg-background border-muted/30 rounded-sm h-11 text-xs font-semibold text-primary"
                    {...register("telefon")}
                  />
                  {errors.telefon && (
                    <p className="text-xs font-semibold text-destructive">{errors.telefon.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-sans font-extrabold text-base py-6 rounded-sm shadow-md transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Anfrage wird gesendet...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Unverbindliche B2B-Anfrage absenden</span>
                    </>
                  )}
                </Button>
                <p className="font-sans text-[10px] text-muted text-center mt-3 leading-normal">
                  Mit Absenden des Formulars stimmen Sie der Verarbeitung Ihrer Daten zur Angebotserstellung gemäß unserer Datenschutzerklärung zu. Keine Werbe-Spam-Garantie.
                </p>
              </div>

            </form>
          ) : (
            // Success State
            <div className="p-10 md:p-16 text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
                <CheckCircle2 className="h-10 w-10 text-accent stroke-[3]" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-primary">Vielen Dank für Ihre Anfrage!</h3>
                <p className="font-sans text-base text-muted max-w-lg mx-auto">
                  Ihre Nutzfahrzeug-Anfrage wurde erfolgreich übermittelt. Unser B2B-Spezialist prüft Ihre Daten und erstellt Ihr Angebot.
                </p>
              </div>

              {/* Display lead score details dynamically for professional demonstration */}
              <div className="border border-muted/20 bg-secondary/30 p-4 rounded-sm max-w-md mx-auto text-left space-y-2 font-sans text-xs">
                <div className="flex justify-between">
                  <span className="text-muted font-semibold">Anfrage-Status:</span>
                  <span className="text-primary font-bold">Erfolgreich erfasst</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-semibold">Priorität (Lead Score):</span>
                  <span className={`font-bold ${
                    calculatedScore === "Hot" ? "text-red-600" : calculatedScore === "Warm" ? "text-orange-500" : "text-blue-600"
                  }`}>
                    {calculatedScore === "Hot" ? "Sehr hoch (Hot)" : calculatedScore === "Warm" ? "Hoch (Warm)" : "Standard (Cold)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-semibold">Geschätzte Rückmeldezeit:</span>
                  <span className="text-primary font-bold">
                    {calculatedScore === "Hot" ? "< 4 Stunden" : calculatedScore === "Warm" ? "< 12 Stunden" : "< 24 Stunden"}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    reset();
                  }}
                  variant="outline"
                  className="font-sans font-bold text-xs border-primary text-primary rounded-sm"
                >
                  Neue Anfrage starten
                </Button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

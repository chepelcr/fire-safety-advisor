export type Category = "iniciacion" | "notificacion" | "monitoreo" | "accionamiento";
export type RiskLevel = "alto" | "medio" | "bajo";
export type BuildingType = "residencial" | "comercial" | "industrial";

export interface Rule {
  id: string;
  standard: string;
  category: Category;
  component: string;
  component_en: string;
  practical_interpretation: string;
  practical_interpretation_en: string;
  risk_level: RiskLevel;
  applies_to: BuildingType[];
  keywords?: string[];
  validation_logic?: { required?: boolean; conditions?: string[] };
}

export const knowledgeBase: Rule[] = [
  {
    id: "smoke_detectors_basic",
    standard: "NFPA 72",
    category: "iniciacion",
    component: "Detectores de humo",
    component_en: "Smoke detectors",
    practical_interpretation:
      "Instalar en pasillos, dormitorios y áreas de descanso en residencias. Cobertura total en comercios.",
    practical_interpretation_en:
      "Install in hallways, bedrooms and rest areas in residences. Full coverage in commercial spaces.",
    risk_level: "alto",
    applies_to: ["residencial", "comercial"],
    keywords: ["humo", "detector", "smoke", "detectores"],
    validation_logic: { required: true },
  },
  {
    id: "manual_pull_station",
    standard: "NFPA 72",
    category: "iniciacion",
    component: "Estación manual",
    component_en: "Manual pull station",
    practical_interpretation:
      "Debe colocarse en rutas de evacuación y salidas principales, máx. 1.5 m de altura.",
    practical_interpretation_en:
      "Place along evacuation routes and main exits, max. 1.5 m height.",
    risk_level: "alto",
    applies_to: ["comercial", "industrial"],
    keywords: ["pull", "manual", "estacion", "alarma manual"],
  },
  {
    id: "audible_alarm",
    standard: "NFPA 72",
    category: "notificacion",
    component: "Sirenas audibles",
    component_en: "Audible alarms",
    practical_interpretation:
      "Deben ser audibles (≥15 dB sobre ruido ambiente) en todas las áreas ocupadas.",
    practical_interpretation_en:
      "Must be audible (≥15 dB above ambient noise) in all occupied areas.",
    risk_level: "alto",
    applies_to: ["residencial", "comercial", "industrial"],
    keywords: ["sirena", "audible", "alarma", "alarm", "horn"],
  },
  {
    id: "visual_alarm",
    standard: "NFPA 72",
    category: "notificacion",
    component: "Estrobos visuales",
    component_en: "Visual strobes",
    practical_interpretation:
      "Requeridos en lugares públicos y accesibles para personas con discapacidad auditiva.",
    practical_interpretation_en:
      "Required in public and accessible spaces for hearing-impaired occupants.",
    risk_level: "medio",
    applies_to: ["comercial", "industrial"],
    keywords: ["estrobo", "visual", "strobe", "luz"],
  },
  {
    id: "exit_routes",
    standard: "NFPA 101",
    category: "notificacion",
    component: "Rutas de evacuación",
    component_en: "Evacuation routes",
    practical_interpretation:
      "Señalizadas, iluminadas con luces de emergencia y libres de obstrucciones en todo momento.",
    practical_interpretation_en:
      "Signed, lit with emergency lighting and kept clear of obstructions at all times.",
    risk_level: "alto",
    applies_to: ["residencial", "comercial", "industrial"],
    keywords: ["evacuacion", "salida", "exit", "ruta", "egress"],
  },
  {
    id: "central_monitoring",
    standard: "NFPA 72",
    category: "monitoreo",
    component: "Monitoreo central",
    component_en: "Central station monitoring",
    practical_interpretation:
      "El sistema debe reportar eventos a una estación remota certificada o al cuerpo de bomberos.",
    practical_interpretation_en:
      "The system must report events to a certified remote station or fire department.",
    risk_level: "alto",
    applies_to: ["comercial", "industrial"],
    keywords: ["monitoreo", "central", "monitoring", "supervision"],
  },
  {
    id: "maintenance_schedule",
    standard: "NFPA 25",
    category: "monitoreo",
    component: "Mantenimiento de sistemas",
    component_en: "Systems maintenance",
    practical_interpretation:
      "Inspección periódica obligatoria: trimestral para válvulas, anual para rociadores y bombas.",
    practical_interpretation_en:
      "Mandatory periodic inspection: quarterly for valves, annual for sprinklers and pumps.",
    risk_level: "alto",
    applies_to: ["comercial", "industrial"],
    keywords: ["mantenimiento", "inspeccion", "maintenance", "itm"],
  },
  {
    id: "sprinkler_system",
    standard: "NFPA 13",
    category: "accionamiento",
    component: "Sistema de rociadores",
    component_en: "Sprinkler system",
    practical_interpretation:
      "Requerido en edificios comerciales >280 m² o de alto riesgo (cocinas, bodegas, hoteles).",
    practical_interpretation_en:
      "Required in commercial buildings >280 m² or high-hazard occupancies (kitchens, warehouses, hotels).",
    risk_level: "alto",
    applies_to: ["comercial", "industrial"],
    keywords: ["rociador", "sprinkler", "supresion", "agua"],
    validation_logic: { conditions: ["area > 280"] },
  },
  {
    id: "kitchen_suppression",
    standard: "NFPA 96",
    category: "accionamiento",
    component: "Supresión de cocina",
    component_en: "Kitchen suppression",
    practical_interpretation:
      "Cocinas comerciales con freidores o planchas requieren sistema químico húmedo bajo la campana.",
    practical_interpretation_en:
      "Commercial kitchens with fryers or grills require a wet chemical hood suppression system.",
    risk_level: "alto",
    applies_to: ["comercial"],
    keywords: ["cocina", "restaurante", "kitchen", "restaurant", "campana", "grasa"],
  },
  {
    id: "fire_pump",
    standard: "NFPA 20",
    category: "accionamiento",
    component: "Bomba contra incendios",
    component_en: "Fire pump",
    practical_interpretation:
      "Necesaria cuando la presión de la red municipal no garantiza el caudal de diseño.",
    practical_interpretation_en:
      "Required when municipal pressure does not guarantee design flow.",
    risk_level: "alto",
    applies_to: ["industrial", "comercial"],
    keywords: ["bomba", "pump", "presion"],
  },
  {
    id: "electrical_grounding",
    standard: "NFPA 70",
    category: "accionamiento",
    component: "Puesta a tierra",
    component_en: "Electrical grounding",
    practical_interpretation:
      "Reduce el riesgo de incendio por fallas eléctricas. Obligatoria en todo tablero principal.",
    practical_interpretation_en:
      "Reduces fire risk from electrical faults. Mandatory at every main panel.",
    risk_level: "alto",
    applies_to: ["residencial", "comercial", "industrial"],
    keywords: ["tierra", "ground", "electrico", "electrical", "tablero"],
  },
  {
    id: "warehouse_storage",
    standard: "NFPA 13",
    category: "accionamiento",
    component: "Rociadores ESFR para bodegas",
    component_en: "ESFR sprinklers for warehouses",
    practical_interpretation:
      "Bodegas con almacenamiento >3.7 m requieren rociadores tipo ESFR o en rack.",
    practical_interpretation_en:
      "Warehouses with storage >3.7 m require ESFR or in-rack sprinklers.",
    risk_level: "alto",
    applies_to: ["industrial"],
    keywords: ["bodega", "warehouse", "almacen", "rack", "esfr"],
  },
];

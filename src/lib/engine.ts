import { knowledgeBase, type Rule, type BuildingType, type Category, type RiskLevel } from "@/data/knowledgeBase";

export interface AnalysisInput {
  buildingType: BuildingType;
  area?: number;
  context?: string; // free text e.g. "restaurant", "warehouse"
}

const contextBoost: Record<string, string[]> = {
  restaurante: ["kitchen_suppression", "sprinkler_system", "audible_alarm", "exit_routes"],
  restaurant: ["kitchen_suppression", "sprinkler_system", "audible_alarm", "exit_routes"],
  bodega: ["warehouse_storage", "sprinkler_system", "fire_pump"],
  warehouse: ["warehouse_storage", "sprinkler_system", "fire_pump"],
  hotel: ["sprinkler_system", "smoke_detectors_basic", "exit_routes", "central_monitoring"],
  oficina: ["smoke_detectors_basic", "audible_alarm", "exit_routes"],
  office: ["smoke_detectors_basic", "audible_alarm", "exit_routes"],
};

export function analyze(input: AnalysisInput): Rule[] {
  const ctx = (input.context || "").toLowerCase();
  const boosted = new Set<string>();
  Object.keys(contextBoost).forEach((k) => {
    if (ctx.includes(k)) contextBoost[k].forEach((id) => boosted.add(id));
  });

  return knowledgeBase.filter((r) => {
    if (!r.applies_to.includes(input.buildingType)) return false;
    const conds = r.validation_logic?.conditions;
    if (conds && conds.some((c) => c.includes("area"))) {
      const match = conds.map((c) => /area\s*>\s*(\d+)/.exec(c)).find(Boolean);
      if (match && input.area !== undefined) {
        const min = parseInt(match[1], 10);
        if (input.area <= min && !boosted.has(r.id)) return false;
      }
    }
    return true;
  });
}

export function groupByCategory(rules: Rule[]): Record<Category, Rule[]> {
  const out: Record<Category, Rule[]> = {
    iniciacion: [], notificacion: [], monitoreo: [], accionamiento: [],
  };
  rules.forEach((r) => out[r.category].push(r));
  return out;
}

export interface ChatAnswer {
  matchedRules: Rule[];
  summary: string;
  summary_en: string;
  risk: RiskLevel;
  references: string[];
}

const stopwords = new Set(["el","la","los","las","un","una","de","del","en","y","o","para","que","es","son","con","mi","tu","su","necesito","need","do","i","a","an","the","what","which","does","need","system","sistema"]);

export function answerQuestion(question: string): ChatAnswer {
  const q = question.toLowerCase();
  const tokens = q.split(/[^a-záéíóúñü]+/i).filter((w) => w && !stopwords.has(w));
  const scores = new Map<string, number>();

  knowledgeBase.forEach((r) => {
    let score = 0;
    const hay = [
      r.component, r.component_en, r.standard,
      r.practical_interpretation, r.practical_interpretation_en,
      ...(r.keywords || []),
    ].join(" ").toLowerCase();
    tokens.forEach((tk) => { if (hay.includes(tk)) score += 1; });
    // Context bonuses
    Object.entries(contextBoost).forEach(([k, ids]) => {
      if (q.includes(k) && ids.includes(r.id)) score += 3;
    });
    if (score > 0) scores.set(r.id, score);
  });

  const matched = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => knowledgeBase.find((r) => r.id === id)!)
    .filter(Boolean);

  const risk: RiskLevel = matched.some((r) => r.risk_level === "alto")
    ? "alto" : matched.some((r) => r.risk_level === "medio") ? "medio" : "bajo";

  const refs = [...new Set(matched.map((r) => r.standard))];

  const summary = matched.length
    ? `Sí, según su consulta aplican ${matched.length} requerimientos clave: ${matched.map((m) => m.component).join(", ")}.`
    : "No se encontraron coincidencias específicas. Refine la consulta o seleccione un tipo de edificio en el panel.";
  const summary_en = matched.length
    ? `Yes, ${matched.length} key requirements apply: ${matched.map((m) => m.component_en).join(", ")}.`
    : "No specific matches found. Refine your question or pick a building type in the dashboard.";

  return { matchedRules: matched, summary, summary_en, risk, references: refs };
}

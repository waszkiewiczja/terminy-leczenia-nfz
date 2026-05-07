export function capitalizeWords(s: string) {
  return s
    .toLowerCase()
    .replace(
      /(^|[\s\-."'„”‚‘’])(\p{L})/gu,
      (_, sep, ch) => sep + ch.toUpperCase(),
    );
}

// Map of legal forms that should be removed from provider display names.
const LEGAL_FORM_PATTERNS: Record<string, RegExp> = {
  SP_Z_OO: /\bsp\.?\s*z\.?\s*o\.?\s*o\.?\b/giu,
  SP_J: /\bsp\.?\s*j\.?\b/giu,
  SP_K: /\bsp\.?\s*k\.?\b/giu,
  S_A: /\bs\.?\s*a\.?\b/giu,
  S_C: /\bs\.?\s*c\.?\b/giu,
  SPOLKA_Z_OO:
    /sp[oó][łl]ka\s+z\s+ograniczon[aą]\s+odpowiedzialno[śs]ci[aą]/giu,
  SPOLKA_AKCYJNA: /\bsp[oó]łka\s+akcyjna\b/giu,
  SPOLKA_CYWILNA: /\bsp[oó]łka\s+cywilna\b/giu,
  SPOLKA_JAWNA: /\bsp[oó]łka\s+jawna\b/giu,
  SPOLKA_KOMANDYTOWA: /\bsp[oó]łka\s+komandytowa\b/giu,
  SPOLKA_PARTNERSKA: /\bsp[oó]łka\s+partnerska\b/giu,
};

export function stripLegalForms(name: string) {
  let out = name;
  for (const pattern of Object.values(LEGAL_FORM_PATTERNS)) {
    out = out.replace(pattern, " ");
  }

  return out
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/^[\s,\-–—]+|[\s,\-–—]+$/g, "")
    .trim();
}

export function formatProviderDisplayName(name: string) {
  return capitalizeWords(stripLegalForms(name));
}

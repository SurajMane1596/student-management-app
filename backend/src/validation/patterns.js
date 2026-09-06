// Mirrors src/utils/validators.js on the frontend, field for field, so the
// server enforces exactly the same "accepted value" rules from the
// requirement document — defense in depth, not a second source of truth
// that can drift. If a rule changes, update both files together.

export const PATTERNS = {
  clientId: /^[A-Za-z0-9 ]*$/,
  digitsOnly: /^[0-9]*$/,
  password: /^[A-Za-z0-9@#$%* ]*$/,
  alphaSpace: /^[A-Za-z ]*$/,
  freeTextNarrative: /^[A-Za-z ,.]*$/,
  alphaOnly: /^[A-Za-z]*$/,
  numericOnly: /^[0-9]*$/,
};

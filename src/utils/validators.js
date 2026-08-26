// Regex patterns mapped 1:1 to the "Accepted Value" column of the
// Project Requirement Document's field-level specification tables.

export const PATTERNS = {
  clientId: /^[A-Za-z0-9 ]*$/, // A-Z, 0-9, space
  digitsOnly: /^[0-9]*$/, // 0-9
  password: /^[A-Za-z0-9@#$%* ]*$/, // A-Z, a-z, 0-9, @ # $ % *, space
  alphaSpace: /^[A-Za-z ]*$/, // A-Z, a-z, space
  freeTextNarrative: /^[A-Za-z ,.]*$/, // A-Z, a-z, space, comma, full stop
  alphaOnly: /^[A-Za-z]*$/, // A-Z (Division)
  numericOnly: /^[0-9]*$/, // 0-9 (Standard)
};

export const MESSAGES = {
  clientId: "Only letters, numbers and spaces are allowed",
  digitsOnly: "Only numbers are allowed",
  password: "Only letters, numbers and @ # $ % * are allowed",
  alphaSpace: "Only letters and spaces are allowed",
  freeTextNarrative: "Only letters, spaces, commas and full stops are allowed",
  alphaOnly: "Only letters are allowed",
  numericOnly: "Only numbers are allowed",
  mobileLength: "Mobile number must be exactly 10 digits",
};

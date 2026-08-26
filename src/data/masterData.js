/**
 * Master Data Reference
 * ----------------------
 * Central source of truth for all dropdown / select master lists used
 * across the application (Section 6 of the Project Requirement Document).
 *
 * In a future iteration these can be swapped for API-driven lookups
 * (e.g. GET /api/master/cities) without touching any consuming component,
 * since every consumer imports from this module rather than hardcoding values.
 */

export const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"];

export const BLOOD_GROUP_OPTIONS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const CITY_OPTIONS = [
  "Vashi",
  "Koparkhairane",
  "Ghansoli",
  "Rabale",
  "Airoli",
  "Sanpada",
  "Juinagar",
  "Nerul",
  "Seawoods",
  "CBD Belapur",
];

// Single-value masters today; modelled as arrays so they can grow without
// any change to the form components that consume them.
export const DISTRICT_OPTIONS = ["Thane"];

export const STATE_OPTIONS = ["Maharashtra"];

export const SCHOOL_DAYS_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const CONTACT_INFO = {
  contactPerson: "Suraj Mane",
  contactNumber: "9619306969",
  email: "client.support@gmail.com",
};

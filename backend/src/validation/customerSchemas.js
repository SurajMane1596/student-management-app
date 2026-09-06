import { z } from "zod";
import { PATTERNS } from "./patterns.js";

// The frontend represents blood group as "A+", "B-", etc. Postgres enums
// can't contain "+"/"-" as bare identifiers, so the DB enum uses A_POS /
// A_NEG etc. These maps are the single place that translation happens.
export const BLOOD_GROUP_TO_DB = {
  "A+": "A_POS",
  "A-": "A_NEG",
  "B+": "B_POS",
  "B-": "B_NEG",
  "AB+": "AB_POS",
  "AB-": "AB_NEG",
  "O+": "O_POS",
  "O-": "O_NEG",
};
export const BLOOD_GROUP_FROM_DB = Object.fromEntries(
  Object.entries(BLOOD_GROUP_TO_DB).map(([k, v]) => [v, k])
);

export const WEEK_DAY_TO_DB = {
  Monday: "MONDAY",
  Tuesday: "TUESDAY",
  Wednesday: "WEDNESDAY",
  Thursday: "THURSDAY",
  Friday: "FRIDAY",
  Saturday: "SATURDAY",
  Sunday: "SUNDAY",
};
export const WEEK_DAY_FROM_DB = Object.fromEntries(
  Object.entries(WEEK_DAY_TO_DB).map(([k, v]) => [v, k])
);

const requiredAlphaSpace = (max) => z.string().min(1).max(max).regex(PATTERNS.alphaSpace);
const requiredDigits = (len) => z.string().length(len).regex(PATTERNS.digitsOnly);
const requiredNarrative = (max) => z.string().min(1).max(max).regex(PATTERNS.freeTextNarrative);

export const customerBodySchema = z.object({
  studentFirstName: requiredAlphaSpace(40),
  studentMiddleName: requiredAlphaSpace(40),
  studentLastName: requiredAlphaSpace(40),

  parentName: requiredAlphaSpace(100),
  parentContactNumber: requiredDigits(10),

  studentGender: z.enum(["MALE", "FEMALE", "OTHER"]),
  age: z.coerce.number().int().min(0).max(30).optional().nullable(),
  dob: z.coerce.date(),
  bloodGroup: z.enum(Object.keys(BLOOD_GROUP_TO_DB)).optional().nullable(),

  medicalHistory: requiredNarrative(250),
  emergencyContactNumber: requiredDigits(10),

  addressLine1: requiredNarrative(250),
  addressLine2: requiredNarrative(250),
  city: z.string().min(1),
  district: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1).max(10).regex(PATTERNS.digitsOnly),

  schoolName: z.string().min(1).max(100).regex(PATTERNS.alphaSpace),
  standard: z.string().min(1).max(2).regex(PATTERNS.numericOnly),
  division: z.string().max(2).regex(PATTERNS.alphaOnly).optional().nullable().or(z.literal("")),
  groupHouse: z.string().max(5).regex(PATTERNS.alphaSpace).optional().nullable().or(z.literal("")),
  classTeacherName: z
    .string()
    .max(100)
    .regex(PATTERNS.alphaSpace)
    .optional()
    .nullable()
    .or(z.literal("")),
  classTeacherContactNumber: z
    .string()
    .max(10)
    .regex(PATTERNS.digitsOnly)
    .optional()
    .nullable()
    .or(z.literal("")),
  schoolInTime: z.string().min(1),
  schoolOutTime: z.string().min(1),
  schoolDays: z.array(z.enum(Object.keys(WEEK_DAY_TO_DB))).min(1),
});

export const listCustomersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

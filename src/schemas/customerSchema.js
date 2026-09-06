import { z } from "zod";
import { PATTERNS, MESSAGES } from "../utils/validators";
import {
  GENDER_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  CITY_OPTIONS,
  DISTRICT_OPTIONS,
  STATE_OPTIONS,
  SCHOOL_DAYS_OPTIONS,
} from "../data/masterData";

const requiredAlphaSpace = (label, max) =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`)
    .regex(PATTERNS.alphaSpace, MESSAGES.alphaSpace);

const requiredDigits = (label, len, exact = true) =>
  z
    .string()
    .min(1, `${label} is required`)
    .regex(PATTERNS.digitsOnly, MESSAGES.digitsOnly)
    .refine((v) => (exact ? v.length === len : v.length <= len), {
      message: exact
        ? `${label} must be exactly ${len} digits`
        : `${label} must be at most ${len} digits`,
    });

const requiredNarrative = (label, max) =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`)
    .regex(PATTERNS.freeTextNarrative, MESSAGES.freeTextNarrative);

const requiredAddressText = (label, max) =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`)
    .regex(PATTERNS.addressText, MESSAGES.addressText);

// Section 5.5 — Add Customer Screen
export const customerSchema = z.object({
  // Student details
  studentFirstName: requiredAlphaSpace("Student First Name", 40),
  studentMiddleName: requiredAlphaSpace("Student Middle Name", 40),
  studentLastName: requiredAlphaSpace("Student Last Name", 40),

  // Parent details
  parentName: requiredAlphaSpace("Parent Name", 100),
  parentContactNumber: requiredDigits("Parent Contact Number", 10),

  // Demographics
  studentGender: z.enum(GENDER_OPTIONS, {
    errorMap: () => ({ message: "Please select Student Gender" }),
  }),
  age: z
    .string()
    .regex(PATTERNS.digitsOnly, MESSAGES.digitsOnly)
    .optional()
    .or(z.literal("")),
  dob: z.string().min(1, "Date of Birth is required"),
  bloodGroup: z.enum([...BLOOD_GROUP_OPTIONS, ""]).optional(),

  // Medical
  medicalHistory: requiredNarrative("Medical History", 250),
  emergencyContactNumber: requiredDigits("Emergency Contact Number", 10),

  // Address
  addressLine1: requiredAddressText("Address Line 1", 250),
  addressLine2: requiredAddressText("Address Line 2", 250),
  city: z.enum(CITY_OPTIONS, {
    errorMap: () => ({ message: "Please select City" }),
  }),
  district: z.enum(DISTRICT_OPTIONS, {
    errorMap: () => ({ message: "Please select District" }),
  }),
  state: z.enum(STATE_OPTIONS, {
    errorMap: () => ({ message: "Please select State" }),
  }),
  pincode: requiredDigits("Pincode", 10, false),

  // School
  schoolName: z
    .string()
    .min(1, "School Name is required")
    .max(100, "School Name must be at most 100 characters")
    .regex(PATTERNS.alphaSpace, MESSAGES.alphaSpace),
  standard: z
    .string()
    .min(1, "Standard is required")
    .max(2, "Standard must be at most 2 digits")
    .regex(PATTERNS.numericOnly, MESSAGES.numericOnly),
  division: z
    .string()
    .max(2, "Division must be at most 2 characters")
    .regex(PATTERNS.alphaOnly, MESSAGES.alphaOnly)
    .optional()
    .or(z.literal("")),
  groupHouse: z
    .string()
    .max(5, "Group / House must be at most 5 characters")
    .regex(PATTERNS.alphaSpace, MESSAGES.alphaSpace)
    .optional()
    .or(z.literal("")),
  classTeacherName: z
    .string()
    .max(100, "Class Teacher Name must be at most 100 characters")
    .regex(PATTERNS.alphaSpace, MESSAGES.alphaSpace)
    .optional()
    .or(z.literal("")),
  classTeacherContactNumber: z
    .string()
    .max(10, "Class Teacher Contact Number must be at most 10 digits")
    .regex(PATTERNS.digitsOnly, MESSAGES.digitsOnly)
    .optional()
    .or(z.literal("")),
  schoolInTime: z.string().min(1, "School In Time is required"),
  schoolOutTime: z.string().min(1, "School Out Time is required"),
  schoolDays: z
    .array(z.enum(SCHOOL_DAYS_OPTIONS))
    .min(1, "Please select at least one School Day"),
});

export const customerDefaultValues = {
  studentFirstName: "",
  studentMiddleName: "",
  studentLastName: "",
  parentName: "",
  parentContactNumber: "",
  studentGender: undefined,
  age: "",
  dob: "",
  bloodGroup: "",
  medicalHistory: "",
  emergencyContactNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: undefined,
  district: "Thane",
  state: "Maharashtra",
  pincode: "",
  schoolName: "",
  standard: "",
  division: "",
  groupHouse: "",
  classTeacherName: "",
  classTeacherContactNumber: "",
  schoolInTime: "",
  schoolOutTime: "",
  schoolDays: [],
};

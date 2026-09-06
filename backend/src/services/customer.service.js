import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/errorHandler.js";
import {
  BLOOD_GROUP_TO_DB,
  BLOOD_GROUP_FROM_DB,
  WEEK_DAY_TO_DB,
  WEEK_DAY_FROM_DB,
} from "../validation/customerSchemas.js";

function toApiStudent(student) {
  return {
    id: student.id,
    studentFirstName: student.firstName,
    studentMiddleName: student.middleName,
    studentLastName: student.lastName,
    parentName: student.parentName,
    parentContactNumber: student.parentContactNumber,
    studentGender: student.gender,
    age: student.age ?? "",
    dob: student.dob.toISOString().slice(0, 10),
    bloodGroup: student.bloodGroup ? BLOOD_GROUP_FROM_DB[student.bloodGroup] : "",
    medicalHistory: student.medicalHistory,
    emergencyContactNumber: student.emergencyContactNumber,
    addressLine1: student.addressLine1,
    addressLine2: student.addressLine2,
    city: student.city,
    district: student.district,
    state: student.state,
    pincode: student.pincode,
    schoolName: student.schoolName,
    standard: student.standard,
    division: student.division ?? "",
    groupHouse: student.groupHouse ?? "",
    classTeacherName: student.classTeacherName ?? "",
    classTeacherContactNumber: student.classTeacherContactNumber ?? "",
    schoolInTime: student.schoolInTime,
    schoolOutTime: student.schoolOutTime,
    schoolDays: (student.schoolDays || []).map((d) => WEEK_DAY_FROM_DB[d.day]),
  };
}

function toDbData(body) {
  return {
    firstName: body.studentFirstName,
    middleName: body.studentMiddleName,
    lastName: body.studentLastName,
    parentName: body.parentName,
    parentContactNumber: body.parentContactNumber,
    gender: body.studentGender,
    age: body.age ?? null,
    dob: body.dob,
    bloodGroup: body.bloodGroup ? BLOOD_GROUP_TO_DB[body.bloodGroup] : null,
    medicalHistory: body.medicalHistory,
    emergencyContactNumber: body.emergencyContactNumber,
    addressLine1: body.addressLine1,
    addressLine2: body.addressLine2,
    city: body.city,
    district: body.district,
    state: body.state,
    pincode: body.pincode,
    schoolName: body.schoolName,
    standard: body.standard,
    division: body.division || null,
    groupHouse: body.groupHouse || null,
    classTeacherName: body.classTeacherName || null,
    classTeacherContactNumber: body.classTeacherContactNumber || null,
    schoolInTime: body.schoolInTime,
    schoolOutTime: body.schoolOutTime,
  };
}

const withSchoolDays = { schoolDays: true };

export async function listCustomers(userId, { page, pageSize }) {
  const [items, total] = await Promise.all([
    prisma.student.findMany({
      where: { userId },
      include: withSchoolDays,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.student.count({ where: { userId } }),
  ]);

  return {
    customers: items.map(toApiStudent),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  };
}

export async function getCustomer(userId, id) {
  const student = await prisma.student.findFirst({
    where: { id, userId },
    include: withSchoolDays,
  });
  if (!student) throw new AppError("Customer not found.", 404);
  return toApiStudent(student);
}

export async function createCustomer(userId, body) {
  const student = await prisma.student.create({
    data: {
      ...toDbData(body),
      userId,
      schoolDays: {
        create: body.schoolDays.map((day) => ({ day: WEEK_DAY_TO_DB[day] })),
      },
    },
    include: withSchoolDays,
  });
  return toApiStudent(student);
}

export async function updateCustomer(userId, id, body) {
  const existing = await prisma.student.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError("Customer not found.", 404);

  const student = await prisma.$transaction(async (tx) => {
    await tx.studentSchoolDay.deleteMany({ where: { studentId: id } });
    return tx.student.update({
      where: { id },
      data: {
        ...toDbData(body),
        schoolDays: {
          create: body.schoolDays.map((day) => ({ day: WEEK_DAY_TO_DB[day] })),
        },
      },
      include: withSchoolDays,
    });
  });

  return toApiStudent(student);
}

export async function deleteCustomer(userId, id) {
  const existing = await prisma.student.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError("Customer not found.", 404);
  await prisma.student.delete({ where: { id } });
}

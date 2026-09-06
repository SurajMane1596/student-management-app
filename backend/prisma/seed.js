// Seeds a demo user, sample students, and lookup-table master data.
// Run with: npm run seed
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash("Demo@234");

  const user = await prisma.user.upsert({
    where: { clientId: "DEMO0002" },
    update: {},
    create: {
      clientId: "DEMO0002",
      mobileNumber: "9004366669",
      passwordHash,
      userName: "Balasaheb Mane",
      email: "Balasaheb.mane@example.com",
      clientName: "DEMO0002",
      subscriptionStatus: "ACTIVE",
    },
  });

  const existing = await prisma.student.findFirst({
    where: { userId: user.id },
  });
  if (!existing) {
    await prisma.student.create({
      data: {
        userId: user.id,
        firstName: "Aarav",
        middleName: "Suraj",
        lastName: "Mane",
        parentName: "Suraj Mane",
        parentContactNumber: "9619306969",
        gender: "MALE",
        age: 9,
        dob: new Date("2017-03-12"),
        bloodGroup: "B_POS",
        medicalHistory: "No known allergies, mild seasonal cold in winter.",
        emergencyContactNumber: "9619306969",
        addressLine1: "Plot 12, Sector 15",
        addressLine2: "Near City Park, Vashi",
        city: "Vashi",
        district: "Thane",
        state: "Maharashtra",
        pincode: "400703",
        schoolName: "Ryan International School",
        standard: "4",
        division: "B",
        groupHouse: "Blue",
        classTeacherName: "Mrs Kavita Rao",
        classTeacherContactNumber: "9820012345",
        schoolInTime: "08:00",
        schoolOutTime: "14:30",
        schoolDays: {
          create: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map(
            (day) => ({ day }),
          ),
        },
      },
    });
  }

  const cities = [
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
  const districts = ["Thane"];
  const states = ["Maharashtra"];

  await prisma.city.createMany({
    data: cities.map((name) => ({ name })),
    skipDuplicates: true,
  });
  await prisma.district.createMany({
    data: districts.map((name) => ({ name })),
    skipDuplicates: true,
  });
  await prisma.state.createMany({
    data: states.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log(
    "Seed complete. Demo login -> Client Id: DEMO0001, Mobile: 9619306969, Password: Demo@123",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscription_status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "client_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "parent_name" TEXT NOT NULL,
    "parent_contact_number" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "age" INTEGER,
    "dob" TIMESTAMP(3) NOT NULL,
    "blood_group" "BloodGroup",
    "medical_history" TEXT NOT NULL,
    "emergency_contact_number" TEXT NOT NULL,
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "standard" TEXT NOT NULL,
    "division" TEXT,
    "group_house" TEXT,
    "class_teacher_name" TEXT,
    "class_teacher_contact_number" TEXT,
    "school_in_time" TEXT NOT NULL,
    "school_out_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_school_days" (
    "student_id" TEXT NOT NULL,
    "day" "WeekDay" NOT NULL,

    CONSTRAINT "student_school_days_pkey" PRIMARY KEY ("student_id","day")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_client_id_key" ON "users"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_number_key" ON "users"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_client_id_idx" ON "users"("client_id");

-- CreateIndex
CREATE INDEX "users_mobile_number_idx" ON "users"("mobile_number");

-- CreateIndex
CREATE INDEX "students_user_id_idx" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "districts_name_key" ON "districts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "states_name_key" ON "states"("name");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_school_days" ADD CONSTRAINT "student_school_days_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

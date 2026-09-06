import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeading, SectionCard, Spinner } from "../components/ui/Atoms";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import TextArea from "../components/ui/TextArea";
import MultiSelectDays from "../components/ui/MultiSelectDays";
import { customerSchema, customerDefaultValues } from "../schemas/customerSchema";
import {
  GENDER_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  CITY_OPTIONS,
  DISTRICT_OPTIONS,
  STATE_OPTIONS,
  SCHOOL_DAYS_OPTIONS,
} from "../data/masterData";
import { useAuth } from "../context/AuthContext";
import * as api from "../api/customerApi";

export default function AddCustomer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loadingRecord, setLoadingRecord] = useState(isEditMode);
  const [serverError, setServerError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: customerDefaultValues,
  });

  useEffect(() => {
    if (!isEditMode) return;
    let mounted = true;
    api.getCustomer(id).then((res) => {
      if (!mounted) return;
      if (res.ok) {
        const { id: _omit, ownerClientId: _omit2, ...formValues } = res.customer;
        reset(formValues);
      } else {
        setServerError(res.error);
      }
      setLoadingRecord(false);
    });
    return () => {
      mounted = false;
    };
  }, [id, isEditMode, reset]);

  async function onSubmit(values) {
    setServerError("");
    const res = isEditMode
      ? await api.updateCustomer(id, values)
      : await api.createCustomer(user.clientId, values);

    if (res.ok) {
      navigate("/customers");
    } else {
      setServerError(res.error || "Could not save customer. Please try again.");
    }
  }

  if (loadingRecord) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="w-6 h-6 text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <PageHeading
        title={isEditMode ? "Edit Customer" : "Add Customer"}
        subtitle="Capture complete student, parent, medical and school details"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {serverError}
          </div>
        )}

        <SectionCard title="Student Details">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Student First Name"
              required
              maxLength={40}
              error={errors.studentFirstName?.message}
              {...register("studentFirstName")}
            />
            <Input
              label="Student Middle Name"
              required
              maxLength={40}
              error={errors.studentMiddleName?.message}
              {...register("studentMiddleName")}
            />
            <Input
              label="Student Last Name"
              required
              maxLength={40}
              error={errors.studentLastName?.message}
              {...register("studentLastName")}
            />
            <Select
              label="Student Gender"
              required
              options={GENDER_OPTIONS}
              error={errors.studentGender?.message}
              {...register("studentGender")}
            />
            <Input
              label="Age"
              maxLength={3}
              inputMode="numeric"
              error={errors.age?.message}
              {...register("age")}
            />
            <Input
              label="DOB"
              required
              type="date"
              error={errors.dob?.message}
              {...register("dob")}
            />
            <Select
              label="Blood Group"
              options={BLOOD_GROUP_OPTIONS}
              error={errors.bloodGroup?.message}
              {...register("bloodGroup")}
            />
          </div>
        </SectionCard>

        <SectionCard title="Parent Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Parent Name"
              required
              maxLength={100}
              error={errors.parentName?.message}
              {...register("parentName")}
            />
            <Input
              label="Parent Contact Number"
              required
              maxLength={10}
              inputMode="numeric"
              error={errors.parentContactNumber?.message}
              {...register("parentContactNumber")}
            />
          </div>
        </SectionCard>

        <SectionCard title="Medical Details">
          <div className="grid grid-cols-1 gap-4">
            <TextArea
              label="Medical History"
              required
              maxLength={250}
              placeholder="Allergies, conditions, medications, etc."
              error={errors.medicalHistory?.message}
              {...register("medicalHistory")}
            />
            <Input
              label="Emergency Contact Number"
              required
              maxLength={10}
              inputMode="numeric"
              className="sm:max-w-xs"
              error={errors.emergencyContactNumber?.message}
              {...register("emergencyContactNumber")}
            />
          </div>
        </SectionCard>

        <SectionCard title="Address Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextArea
              label="Address Line 1"
              required
              maxLength={250}
              className="sm:col-span-2"
              error={errors.addressLine1?.message}
              {...register("addressLine1")}
            />
            <TextArea
              label="Address Line 2"
              required
              maxLength={250}
              className="sm:col-span-2"
              error={errors.addressLine2?.message}
              {...register("addressLine2")}
            />
            <Select
              label="City"
              required
              options={CITY_OPTIONS}
              error={errors.city?.message}
              {...register("city")}
            />
            <Select
              label="District"
              required
              options={DISTRICT_OPTIONS}
              error={errors.district?.message}
              {...register("district")}
            />
            <Select
              label="State"
              required
              options={STATE_OPTIONS}
              error={errors.state?.message}
              {...register("state")}
            />
            <Input
              label="Pincode"
              required
              maxLength={10}
              inputMode="numeric"
              error={errors.pincode?.message}
              {...register("pincode")}
            />
          </div>
        </SectionCard>

        <SectionCard title="School Details">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="School Name"
              required
              maxLength={100}
              className="sm:col-span-2"
              error={errors.schoolName?.message}
              {...register("schoolName")}
            />
            <Input
              label="Standard"
              required
              maxLength={2}
              inputMode="numeric"
              hint="Numeric only, e.g. 1–10"
              error={errors.standard?.message}
              {...register("standard")}
            />
            <Input
              label="Division"
              maxLength={2}
              hint="Alphabetic only, e.g. A, B"
              error={errors.division?.message}
              {...register("division")}
            />
            <Input
              label="Group / House"
              maxLength={5}
              error={errors.groupHouse?.message}
              {...register("groupHouse")}
            />
            <Input
              label="Class Teacher Name"
              maxLength={100}
              error={errors.classTeacherName?.message}
              {...register("classTeacherName")}
            />
            <Input
              label="Class Teacher Contact Number"
              maxLength={10}
              inputMode="numeric"
              error={errors.classTeacherContactNumber?.message}
              {...register("classTeacherContactNumber")}
            />
            <Input
              label="School In Time"
              required
              type="time"
              error={errors.schoolInTime?.message}
              {...register("schoolInTime")}
            />
            <Input
              label="School Out Time"
              required
              type="time"
              error={errors.schoolOutTime?.message}
              {...register("schoolOutTime")}
            />
            <Controller
              name="schoolDays"
              control={control}
              render={({ field }) => (
                <MultiSelectDays
                  label="School Days"
                  required
                  options={SCHOOL_DAYS_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.schoolDays?.message}
                />
              )}
            />
          </div>
        </SectionCard>

        <div className="flex gap-3 pb-4">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting && <Spinner className="w-4 h-4" />}
            {isEditMode ? "Save Changes" : "Add Customer"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

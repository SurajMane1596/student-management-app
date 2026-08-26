import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X } from "lucide-react";
import { PageHeading, SectionCard, Badge, Spinner } from "../components/ui/Atoms";
import Input from "../components/ui/Input";
import { profileSchema } from "../schemas/profileSchema";
import { useAuth } from "../context/AuthContext";

export default function ViewProfile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saveError, setSaveError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: user?.userName || "",
      contactNumber: user?.contactNumber || "",
      emailId: user?.emailId || "",
      clientName: user?.clientName || "",
    },
  });

  function startEditing() {
    reset({
      userName: user?.userName || "",
      contactNumber: user?.contactNumber || "",
      emailId: user?.emailId || "",
      clientName: user?.clientName || "",
    });
    setSaveError("");
    setEditing(true);
  }

  async function onSubmit(values) {
    setSaveError("");
    const res = await updateProfile(values);
    if (res.ok) {
      setEditing(false);
    } else {
      setSaveError(res.error || "Could not update profile. Please try again.");
    }
  }

  return (
    <div className="max-w-lg">
      <PageHeading
        title="Profile"
        subtitle="View and manage your account details"
        action={
          !editing && (
            <button onClick={startEditing} className="btn-secondary">
              <Pencil size={16} />
              Edit Profile
            </button>
          )
        }
      />

      {!editing ? (
        <SectionCard>
          <dl className="divide-y divide-slate-100">
            <ProfileRow label="User Name" value={user?.userName} />
            <ProfileRow label="Contact Number" value={user?.contactNumber} />
            <ProfileRow
              label="Subscription Status"
              value={
                <Badge tone={user?.subscriptionStatus === "Active" ? "green" : "red"}>
                  {user?.subscriptionStatus}
                </Badge>
              }
            />
            <ProfileRow label="Email Id" value={user?.emailId} />
            <ProfileRow label="Client Name" value={user?.clientName} />
          </dl>
        </SectionCard>
      ) : (
        <SectionCard>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {saveError && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                {saveError}
              </div>
            )}
            <Input
              label="User Name"
              required
              error={errors.userName?.message}
              {...register("userName")}
            />
            <Input
              label="Contact Number"
              required
              maxLength={10}
              inputMode="numeric"
              error={errors.contactNumber?.message}
              {...register("contactNumber")}
            />
            <Input
              label="Email Id"
              required
              type="email"
              error={errors.emailId?.message}
              {...register("emailId")}
            />
            <Input
              label="Client Name"
              required
              error={errors.clientName?.message}
              {...register("clientName")}
            />

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                {isSubmitting && <Spinner className="w-4 h-4" />}
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-secondary"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </SectionCard>
      )}
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-800 text-right">{value || "—"}</dd>
    </div>
  );
}

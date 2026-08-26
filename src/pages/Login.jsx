import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import { Spinner } from "../components/ui/Atoms";
import { loginSchema } from "../schemas/loginSchema";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { clientId: "", mobileNumber: "", password: "" },
  });

  if (!isInitializing && isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || "/home";
    return <Navigate to={redirectTo} replace />;
  }

  async function onSubmit(values) {
    setServerError("");
    const res = await login(values);
    if (res.ok) {
      navigate("/home", { replace: true });
    } else {
      setServerError(res.error || "Login failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white mb-3">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Student Management</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4" noValidate>
          {serverError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
              {serverError}
            </div>
          )}

          <Input
            label="Client Id"
            required
            maxLength={8}
            placeholder="e.g. DEMO0001"
            error={errors.clientId?.message}
            {...register("clientId")}
          />

          <Input
            label="Mobile Number"
            required
            maxLength={10}
            inputMode="numeric"
            placeholder="10-digit mobile number"
            error={errors.mobileNumber?.message}
            {...register("mobileNumber")}
          />

          <PasswordInput
            label="Password"
            required
            maxLength={15}
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
            {isSubmitting && <Spinner className="w-4 h-4" />}
            Sign In
          </button>

          <p className="text-xs text-center text-slate-400 pt-1">
            Demo credentials — Client Id: <span className="font-mono">DEMO0001</span>, Mobile:{" "}
            <span className="font-mono">9619306969</span>, Password:{" "}
            <span className="font-mono">Demo@123</span>
          </p>
        </form>
      </div>
    </div>
  );
}

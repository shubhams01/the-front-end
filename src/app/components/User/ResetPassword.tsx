"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import LoadingScreen from "../Loading/LoadingScreen";
import { motion } from "framer-motion";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For toggling confirm password visibility
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  const onSubmit = async (data: ResetPasswordInputs) => {
    if (!code) {
      setError("Invalid or missing reset code.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:1337/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: data.password,
            passwordConfirmation: data.passwordConfirmation,
            code,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/profile/user"), 5000); 
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-screen max-w-md m-5">
        <h2 className="text-2xl font-semibold text-center mb-6 text-black">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password")}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="passwordConfirmation"
              className="block text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="passwordConfirmation"
                type={showConfirmPassword ? "text" : "password"}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  errors.passwordConfirmation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...register("passwordConfirmation")}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            {errors.passwordConfirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm mt-2">
              Password reset successfully
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-lg shadow-lg bg-black text-white transition duration-300"
            disabled={submitting}
          >
            {submitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, loop: Infinity, ease: "linear" }}
              >
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              </motion.div>
            ) : success ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              </motion.div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
      <LoadingScreen />
    </div>
  );
};

export default ResetPassword;

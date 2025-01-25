import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useModal } from "@/app/context/ModalContext";
import { useAuthStore } from "../../store/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  // password: z
  //   .string()
  //   .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

const Login: React.FC = () => {
  const { login, error } = useAuthStore();
  const { toggleLoginModal, toggleRegisterModal } = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [resetLinkVisible, setResetLinkVisible] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); // State to track success status
  const [isProcessing, setIsProcessing] = useState(false); // State to track if processing is happening

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs | ForgotPasswordInputs>({
    resolver: zodResolver(
      isForgotPassword ? forgotPasswordSchema : loginSchema
    ),
  });

  const onSubmit = async (data: LoginFormInputs | ForgotPasswordInputs) => {
    setIsProcessing(true); 
    if (isForgotPassword) {
      setResetLinkSent(false);
      try {
        const response = await fetch(
          "http://localhost:1337/api/auth/forgot-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email }),
          }
        );
        const result = await response.json();
        console.log("Forgot password response:", result);

        if (response.ok) {
          setResetLinkSent(true);
          setResetLinkVisible(true);
          setTimeout(() => {
            setResetLinkVisible(false);
            setIsForgotPassword(false);
          }, 5000);
        }
      } catch (error) {
        console.error("Forgot password error:", error);
      } finally {
        setIsProcessing(false);
        reset();
      }
    } else {
      try {
        if ("password" in data) {
          const response = await login(data.email, data.password);
          if (response.ok) {
            console.log("Login response:", response);
            setLoginSuccess(true); 
            toggleLoginModal();
          }
        }
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        setIsProcessing(false); 
      }
    }
  };

  const toggleForm = () => {
    setIsForgotPassword(!isForgotPassword);
    setResetLinkVisible(false);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 1.1 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center bg-gray-100 rounded-3xl"
    >
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-black px-10 lg:px-12 whitespace-nowrap">
          {isForgotPassword ? "Forgot Password" : "Login"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 relative">
            <div className="flex items-center mt-1">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute ml-3 text-gray-400"
              />
              <input
                id="email"
                type="email"
                placeholder="Email"
                className={`mt-1 block w-full pl-10 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            animate={{
              opacity: isForgotPassword ? 0 : 1,
              height: isForgotPassword ? 0 : "auto",
            }}
            transition={{ duration: 0.5 }}
            className="overflow-auto"
          >
            <div className="mb-4 relative">
              <div className="flex items-center mt-1">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute ml-3 text-gray-400"
                />
                <input
                  id="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className={`mt-1 block w-full pl-10 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  'password' in errors &&  errors?.password ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-0 mr-3 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {'password' in errors && errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </motion.div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          {isForgotPassword && resetLinkVisible && (
            <p className="text-green-500 text-sm">
              Reset link has been sent to your registered email.
            </p>
          )}

          <p className="mb-2 text text-gray-600">
            {isForgotPassword ? (
              <button
                type="button"
                className="text-blue-500 hover:underline focus:outline-none"
                onClick={toggleForm}
              >
                Back to Login
              </button>
            ) : (
              <button
                type="button"
                className="text-blue-500 hover:underline focus:outline-none"
                onClick={toggleForm}
              >
                Forgot Password?
              </button>
            )}
          </p>

          <button
            type="submit"
            className="w-full py-2 rounded-lg shadow-lg bg-black text-white transition duration-300"
            disabled={isProcessing} // Disable button while processing
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, loop: Infinity, ease: "linear" }}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500"
                />
              </motion.div>
            ) : loginSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500"
                />
              </motion.div>
            ) : isForgotPassword ? (
              "Send"
            ) : (
              "Login"
            )}
          </button>
        </form>
        {!isForgotPassword && (
          <p className="mt-4 text-center text-gray-600">
            <span>Don&apos;t have an account?</span>
            <button
              type="button"
              className="text-blue-500 hover:underline focus:outline-none ml-2"
              onClick={() => {
                toggleLoginModal();
                toggleRegisterModal();
              }}
            >
              Register here
            </button>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Login;

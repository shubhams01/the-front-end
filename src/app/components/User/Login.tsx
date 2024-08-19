import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
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
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof schema>;

const Login: React.FC = () => {
  const { login, error } = useAuthStore();
  const { toggleLoginModal, toggleRegisterModal } = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false); // State to manage form submission
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema),
  });

  const animationControls = useAnimation();
  const [success, setSuccess] = useState(false); // State to manage success animation

  const onSubmit = async (data: LoginFormInputs) => {
    setSuccess(true); // Set submitting state when form is submitted
    try {
      await login(data.email, data.password);
      setTimeout(() => {
        toggleLoginModal();
      }, 2000);
      setSuccess(false);
    } catch (error) {
      console.error("Login error:", error);
      setSubmitting(false); // Reset submitting state on error
    }
  };

  const handleRegisterClick = () => {
    toggleLoginModal(); // Close the login modal
    toggleRegisterModal(); // Open the register modal
  };

  useEffect(() => {
    // Reset animation controls when modal reopens
    if (!toggleLoginModal) {
      animationControls.set({ width: "100%" });
    }
  }, [toggleLoginModal, animationControls]);

  const handleAnimation = async () => {
    await animationControls.start({
      width: ["10%", "100%"],
      transition: { duration: 1 },
    });
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
        <h2 className="text-2xl font-semibold text-center mb-6 text-black">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 relative">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <div className="flex items-center mt-1">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute ml-3 text-gray-400"
              />
              <input
                id="email"
                type="email"
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
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <div className="flex items-center mt-1">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute ml-3 text-gray-400"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`mt-1 block w-full pl-10 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  errors.password ? "border-red-500" : "border-gray-300"
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <motion.button
            type="submit"
            className="relative w-full py-2 rounded-lg shadow-lg bg-black text-white transition duration-300"
            disabled={submitting}
            onClick={handleAnimation}
            animate={animationControls}
          >
            <span className="flex items-center justify-center">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="flex items-center justify-center"
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-white mr-2"
                  />
                </motion.div>
              ) : (
                "Login"
              )}
            </span>
          </motion.button>
          <button
            type="button"
            className="w-full flex items-center justify-center p-4 text-black py-2 mt-2 rounded-lg shadow-lg transition duration-300 bg-white hover:bg-gray-100"
          >
            <img
              className="h-5 w-5 mr-2"
              src="https://1000logos.net/wp-content/uploads/2016/11/New-Google-Logo.jpg"
              alt="google"
            />
            <span>Sign in with Google</span>
          </button>
          <p className="mt-4 text-center text-gray-600">
            <span>Don&apos;t have an account?</span>
            <button
              type="button"
              className="text-blue-500 hover:underline focus:outline-none"
              onClick={handleRegisterClick}
            >
              Register here
            </button>
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;

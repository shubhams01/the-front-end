import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../../store/authStore";
import { motion, useAnimation } from "framer-motion";
import { useModal } from "@/app/context/ModalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const schema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters" }),
  })
  .refine(
    (data: { password: any; confirmPassword: any }) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type RegisterFormInputs = z.infer<typeof schema>;

const Register: React.FC = () => {
  const { register: registerUser, error } = useAuthStore();
  const {
    toggleRegisterModal,
    toggleLoginModal,
    setIsLoginOpen,
    setIsRegisterOpen,
  } = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(schema),
  });

  const animationControls = useAnimation();
  const [success, setSuccess] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  const onSubmit = async (data: RegisterFormInputs) => {
    setSuccess(true);
    try {
      const response = await registerUser(
        data.username,
        data.email,
        data.password
      );
      console.log("register response ", response);
      if (response) {
        setIsRegisterSuccess(true);
        setTimeout(() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }, 5000); 
        setSuccess(false);
      }   
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleAnimation = async () => {
    await animationControls.start({
      width: ["20%", "100%"],
      transition: { duration: 0.4 },
    });
  };

  if (isRegisterSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center bg-gray-100 rounded-3xl"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4 text-black">
            Registration Successful
          </h2>
          <p className="text-center text-gray-700">
            A confirmation email has been sent to your registered email address.
            Please check your inbox.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.9 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center bg-gray-100 rounded-3xl"
    >
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-2 text-black">
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
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
          <div className="relative">
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <div className="flex items-center mt-1">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute ml-3 text-gray-400"
              />
              <input
                id="username"
                type="text"
                className={`mt-1 block w-full pl-10 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="relative">
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
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirm Password
            </label>
            <div className="flex items-center mt-1">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute ml-3 text-gray-400"
              />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`mt-1 block w-full pl-10 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute right-0 mr-3 text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <motion.button
            type="submit"
            className="w-full bg-black py-2 rounded-lg shadow-lg  transition duration-300"
            onClick={handleAnimation}
            animate={animationControls}
          >
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
              "Register"
            )}
          </motion.button>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline focus:outline-none"
              onClick={() => {
                toggleRegisterModal();
                toggleLoginModal();
              }}
            >
              Login here
            </button>
          </p>
        </form>
      </div>
      
    </motion.div>
  );
};

export default Register;

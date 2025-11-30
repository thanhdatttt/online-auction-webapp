import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../stores/useAuth.store.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { Controller } from "react-hook-form";
import { useState, useEffect } from "react";

// create schema for validate
const signInSchema = z.object({
  username: z
    .string()
    .min(1, "Please enter username")
    .min(6, "Username must be at least 6 characters"),
  password: z
    .string()
    .min(1, "Please enter password")
    .min(8, "Password must be at least 8 characters"),
  captcha: z.preprocess(
    (val) => val ?? "", // undefined → ""
    z.string().nonempty("Please verify the captcha")
  ),
});

const SignInForm = () => {
  // navigate page
  const navigate = useNavigate();

  // get api
  const { login, continue_with_google } = useAuthStore();

  // validate form
  const {
    register,
    handleSubmit,
    setError,
    control,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });
  const usernameValue = watch("username");
  const passwordValue = watch("password");

  useEffect(() => {
    if (errors.root) {
      clearErrors("root");
    }
  }, [usernameValue, passwordValue]);

  // send data to server
  const onSubmit = async (data) => {
    console.log(data);
    // backend
    try {
      await login(data);
      navigate("/home");
    } catch (err) {
      const field = err.response?.data?.field;
      if (field) {
        setError(field, {
          type: "backend",
          message: err.response?.data?.error,
        });
      } else {
        setError("root", {
          type: "backend",
          message: err.response?.data?.error,
        });
        console.log(err.response);
      }
    }
  };

  return (
    <div className="bg-dark flex overflow-hidden rounded-2xl shadow-2xl">
      {/* left part */}
      <div className="w-1/2 p-10 flex flex-col justify-center h-full">
        {/* title */}
        <h2 className="text-6xl font-lora mb-6">Sign in</h2>
        {/* sign in form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-lora text-3xl">
              Username
            </label>
            <input
              className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                errors.username ? "border-red-500" : "border-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              type="text"
              id="username"
              placeholder="Username"
              {...register("username")}
            />
            {errors.username && (
              <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                {errors.username.message}
              </div>
            )}
            {errors.root && (
              <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                {errors.root.message}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-lora text-3xl">
              Password
            </label>
            <input
              className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                errors.password ? "border-red-500" : "border-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              type="password"
              id="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                {errors.password.message}
              </div>
            )}
          </div>
          <div className="text-right mt-1">
            <a className="text-lg text-gray-300 hover:underline hover:text-blue-400 font-lora font-semibold cursor-pointer">
              Forgot password?
            </a>
          </div>

          <div className="w-full flex flex-col justify-center items-center mt-10">
            <div className="rounded-md overflow-hidden inline-block">
              <Controller
                name="captcha"
                control={control}
                render={({ field: { onChange } }) => (
                  <ReCAPTCHA
                    sitekey="6LdaHwwsAAAAAJv38U44ZcqDczLElUsAAODMz8T7"
                    onChange={onChange}
                  />
                )}
              />
              {/* Display errors */}
              {errors.captcha && (
                <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md w-full">
                  {errors.captcha.message}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-3xl text-white font-semibold rounded-3xl py-2 mt-4 hover:bg-accent hover:text-black transition cursor-pointer"
            disabled={isSubmitting}
          >
            Sign in
          </button>
          <p className="text-lg mt-3 text-gray-300 font-semibold font-lora">
            Don't have an account?{" "}
            <a
              onClick={() => navigate("/signup")}
              className="text-primary hover:underline cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>

      {/* middle part */}
      <div className="flex items-center justify-center w-10 relative">
        <div className="w-1 h-full bg-gray-300"></div>
        <span className="absolute bottom-25 px-2 py-2 text-4xl bg-dark text-gray-200 font-lora font-semibold">
          or
        </span>
      </div>

      {/* right part */}
      <div className="w-1/2 p-10 flex flex-col justify-center items-center">
        <h1 className="text-9xl font-lora font-semibold italic mb-4 text-center text-white">
          Auctiz
        </h1>
        <p className="text-2xl text-center font-lora leading-relaxed mb-10">
          Your gateway to thousands of exciting auctions. Sign in and place your
          bid!
        </p>
        <div>
          <button
            className="w-full py-2 px-8 mb-8 text-2xl font-lora font-semibold flex items-center justify-center gap-2 border border-gray-200 rounded-3xl hover:bg-gray-700 transition cursor-pointer"
            onClick={continue_with_google}
          >
            {" "}
            <FcGoogle size={30}></FcGoogle> Continue with Google
          </button>
          <button className="w-full py-2 px-8 text-2xl font-lora font-semibold flex items-center justify-center gap-2 border border-gray-200 rounded-3xl hover:bg-gray-700 transition cursor-pointer">
            {" "}
            <FaFacebook size={30} color="blue"></FaFacebook> Continue with
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

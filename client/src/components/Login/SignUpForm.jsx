import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { useAuthStore } from "../../stores/useAuth.store.js";
import { Controller } from "react-hook-form";
import { regex } from "../../utils/regex.js";
import ReCAPTCHA from "react-google-recaptcha";
import OtpInput from "react-otp-input";

// create schemas for validating each steps
const step1Schema = z.object({
  email: z.string().min(1, "Email is required").email("Email is not valid"),
  captcha: z.preprocess(
    (val) => val ?? "", // undefined → ""
    z.string().nonempty("Please verify the captcha")
  ),
});

const step2Schema = z.object({
  otp: z
    .string()
    .nonempty("OTP is empty")
    .min(1, "OTP is required")
    .max(6, "OTP must be 6 numbers")
    .regex(regex.otp, "OTP only contains numbers"),
});

const step3Schema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(6, "Username must be at least 6 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        regex.password,
        "Password must contain uppercase, lowercase, numbers and special characters"
      ),
    firstName: z
      .string()
      .trim()
      .transform((v) => v.replace(/\s+/g, " "))
      .refine((v) => !v || v.length >= 2, {
        message: "First name must be at least 2 characters",
      })
      .refine((v) => !v || v.length <= 150, {
        message: "First name must be under 150 characters",
      })
      .refine((v) => !v || regex.name.test(v), {
        message: "Only characters, ' and - are allowed",
      }), 
    lastName: z
      .string()
      .trim()
      .transform((v) => v.replace(/\s+/g, " "))
      .refine((v) => !v || v.length >= 2, {
        message: "Last name must be at least 2 characters",
      })
      .refine((v) => !v || v.length <= 150, {
        message: "Last name must be under 150 characters",
      })
      .refine((v) => !v || regex.name.test(v), {
        message: "Only characters, ' and - are allowed",
      }), 
    address: z
      .string()
      .min(1, "Address is required")
      .max(150, "Address must be under 150 characters")
      .regex(regex.address, "Address is invalid")
      .transform((val) => val.replace(/\s+/g, " ")),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password does not match",
    path: ["confirmPassword"],
  });

const SignUpForm = () => {
  // navigate page
  const navigate = useNavigate();

  // control step state
  const [step, setStep] = useState(1);

  // set up
  const { signup, verify_otp, create_user, continue_with_google } = useAuthStore();

  // update step state
  const nextStep = () => {
    setStep(step + 1);
  };
  const prevStep = () => {
    setStep(step - 1);
  };

  // get current validate schema
  const currentSchema =
    step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema;
  // validate data
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(currentSchema),
    shouldFocusError: false,
  });

  // send data
  const onSubmit = async (data) => {
    if (step === 1) {
      try {
        console.log(data);
        await signup(data);
        nextStep();
      } catch (err) {
        const field = err.response?.data?.field;
        if (field) {
          setError(field, {
            type: "backend",
            message: err.response?.data?.error,
          });
        } else {
          toast.error(err.response?.data?.error);
        }
      }
    } else if (step === 2) {
      try {
        const { otp } = data;
        await verify_otp(otp);
        nextStep();
      } catch (err) {
        const field = err.response?.data?.field;
        if (field) {
          setError(field, {
            type: "backend",
            message: err.response?.data?.error,
          });
        } else {
          toast.error(err.response?.data?.error);
        }
      }
    } else {
      try {
        const { username, password, firstName, lastName, address } = data;
        await create_user(username, password, firstName, lastName, address);
        navigate("/home");
      } catch (err) {
        const apiError =
          err.response?.data?.error || err.response?.data?.message;
        const localError = err.message;

        toast.error(apiError || localError);

        const field = err.response?.data?.field;
        if (field) {
          setError(field, {
            type: "backend",
            message: apiError,
          });
        } else {
          if (localError && localError.includes("token")) {
            setStep(1);
          }
        }
      }
    }
  };

  return (
    <div className="bg-dark font-lora flex overflow-hidden rounded-2xl shadow-2xl">
      <div className="w-full p-20 flex flex-col justify-center h-full">
        <h2 className="text-5xl text-center font-bold mb-8">
          Create your account
        </h2>

        {/* step 1 */}
        {step == 1 && (
          <div className="space-y-6">
            {/* top part */}
            <div>
              <div>
                <label htmlFor="email" className="block text-3xl mb-1">
                  Email
                </label>
                <input
                  className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                    errors.email ? "border-red-500" : "border-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                  type="email"
                  id="email"
                  placeholder="example@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                    {errors.email.message}
                  </div>
                )}
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
              </div>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-accent hover:text-black text-2xl text-white font-semibold py-2 mt-8 rounded-3xl transition cursor-pointer"
              >
                Next
              </button>
              <p className="text-lg my-4 text-gray-300 font-semibold">
                Already have an account?{" "}
                <a
                  onClick={() => navigate("/signin")}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Sign In
                </a>
              </p>
            </div>

            {/* middle part */}
            <div className="flex items-center justify-center my-10 w-full relative">
              <hr className="grow border-gray-300" />
              <span className="absolute px-4 text-3xl bg-dark text-gray-200 font-semibold">
                or
              </span>
            </div>

            {/* bottom part */}
            <div>
              <div className="flex flex-col justify-center items-center font-semibold">
                <button
                  className="w-3/4 py-2 px-4 mb-8 text-2xl flex items-center justify-center gap-2 border border-gray-200 rounded-3xl hover:bg-gray-700 transition cursor-pointer"
                  onClick={continue_with_google}
                >
                  {" "}
                  <FcGoogle size={30}></FcGoogle> Continue with Google
                </button>
                <button className="w-3/4 py-2 px-4 text-2xl flex items-center justify-center gap-2 border border-gray-200 rounded-3xl hover:bg-gray-700 transition cursor-pointer">
                  {" "}
                  <FaFacebook size={30} color="blue"></FaFacebook> Continue with
                  Facebook
                </button>
              </div>
            </div>
          </div>
        )}

        {/* step 2 */}
        {step == 2 && (
          <div className="space-y-6 text-center">
            <p className="text-4xl italic">Verify your email</p>
            <p className="text-2xl italic font-semibold text-gray-300 mb-6">
              We have sent an OTP to your email
            </p>
            <Controller
              control={control}
              name="otp" // Tên field phải khớp với Zod schema
              render={({ field: { onChange, value } }) => (
                <OtpInput
                  value={value}
                  onChange={onChange}
                  numInputs={6}
                  renderInput={(inputProps) => (
                    <input
                      {...inputProps}
                      className="w-14! h-16! text-center text-black font-bold rounded-md bg-white outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  )}
                  containerStyle="flex justify-center gap-7 mb-6"
                />
              )}
            />
            {errors.otp && (
              <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                {errors.otp.message}
              </div>
            )}
            <div className="flex flex-col justify-center items-center">
              <button
                className="w-1/2 bg-primary hover:bg-accent hover:text-black text-2xl text-white font-semibold py-2 mt-8 rounded-3xl transition cursor-pointer"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                Next
              </button>
              <button
                className="w-1/2 bg-primary hover:bg-accent hover:text-black text-2xl text-white font-semibold py-2 mt-8 rounded-3xl transition cursor-pointer"
                onClick={prevStep}
              >
                Go back
              </button>
            </div>
          </div>
        )}

        {/* step 3 */}
        {step == 3 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1 text-3xl">
                Username
              </label>
              <input
                className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                  errors.username ? "border-red-500" : "border-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-primary`}
                type="text"
                id="username"
                placeholder="Enter username"
                {...register("username")}
              />
              {errors.username && (
                <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <div>
                <label htmlFor="firstname" className="block mb-1 text-3xl">
                  First name
                </label>
                <input
                  className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                    errors.username ? "border-red-500" : "border-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                  type="text"
                  id="firstname"
                  placeholder="First name"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                    {errors.firstName.message}
                  </div>
                )}
              </div>
              <div className="flex-1/2">
                <label htmlFor="lastname" className="block mb-1 text-3xl">
                  Last name
                </label>
                <input
                  className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                    errors.username ? "border-red-500" : "border-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                  type="text"
                  id="lastname"
                  placeholder="Last name"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                    {errors.lastName.message}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block mb-1 text-3xl">
                Adrress
              </label>
              <input
                className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                  errors.username ? "border-red-500" : "border-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-primary`}
                type="text"
                id="address"
                placeholder="Enter your address"
                {...register("address")}
              />
              {errors.address && (
                <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                  {errors.address.message}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <div>
                <label htmlFor="password" className="block mb-1 text-3xl">
                  Password
                </label>
                <input
                  className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                    errors.username ? "border-red-500" : "border-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div className="flex-1/2">
                <label
                  htmlFor="confirm-password"
                  className="block mb-1 text-3xl"
                >
                  Confirm password
                </label>
                <input
                  className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                    errors.username ? "border-red-500" : "border-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-primary hover:bg-accent hover:text-black text-2xl text-white font-semibold py-2 my-8 rounded-3xl transition cursor-pointer"
              disabled={isSubmitting}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;

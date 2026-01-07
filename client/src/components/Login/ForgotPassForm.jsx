import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { regex } from "../../utils/regex.js";
import { useAuthStore } from "../../stores/useAuth.store.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import z from "zod";
import Error from "../Error.jsx";
import OtpInput from "react-otp-input";

// create schemas for validating each steps
const step1Schema = z.object({
  email: z.string().min(1, "Email is required").email("Email is not valid"),
});

const step2Schema = z.object({
  otp: z
    .string()
    .nonempty("OTP is empty")
    .min(1, "OTP is required")
    .max(6, "OTP must be 6 numbers")
    .regex(regex.otp, "OTP only contains numbers"),
});

const step3Schema = z.object({
  newPassword:  z
    .string()
    .min(1, "New password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      regex.password,
      "Password must contain uppercase, lowercase, numbers and special characters"
    ),
  confirmPassword: z.string().min(1, "Confirm your new password"),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  error: "Password does not match",
  path: ["confirmPassword"],
});

const ForgetPassForm = () => {
  // navigate
  const navigate = useNavigate();

  // control step state
  const [step, setStep] = useState(1);
  
  // Loading
  const loading = useAuthStore((state) => state.loading);

  // set up
  const { forgot_password, reset_password, verify_otp } = useAuthStore();

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
        await forgot_password(data);
        nextStep();
      } catch (err) {
        console.log(err);
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
          console.log(err.response?.data?.error);
        }
      }
    } else if (step === 3) {
      try {
        // const { newPassword } = data;
        await reset_password(data);
        navigate("/signin");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="bg-dark font-lora flex overflow-hidden rounded-2xl shadow-2xl">
      <div className="w-full p-20 flex flex-col justify-center h-full">
        <h2 className="text-5xl text-center font-bold mb-8">
          Reset your password
        </h2>

        {/* step 1 */}
        {step == 1 && (
          <div className="space-y-6">
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
                <Error message={errors.email.message}/>
                )}
              </div>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className={`w-full bg-primary text-2xl text-white font-semibold py-2 mt-8 rounded-3xl transition 
                  ${
                    loading ? "cursor-not-allowed" 
                    : "cursor-pointer hover:bg-accent hover:text-black"
                  }
                `}
              >
                {loading ? "Sending OTP to email..." : "Next"}
              </button>
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
            <Error message={errors.otp.message}/>
            )}
            <div className="flex flex-col justify-center items-center">
              <button
                className={`w-1/2 bg-primary text-2xl text-white font-semibold py-2 mt-8 rounded-3xl transition
                  ${
                    loading ? "cursor-not-allowed" 
                    : "cursor-pointer hover:bg-accent hover:text-black"
                  }
                `}
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {loading ? "Verifying OTP..." : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* step 3 */}
        {step == 3 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block mb-1 text-3xl">
                New password
              </label>
              <input
                className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                  errors.newPassword ? "border-red-500" : "border-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-primary`}
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
              <Error message={errors.newPassword.message}/>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-3xl">
                Confirm new password
              </label>
              <input
                className={`w-full rounded-md p-2 text-black text-2xl bg-white ${
                  errors.username ? "border-red-500" : "border-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-primary`}
                type="password"
                id="confirmPassword"
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
              <Error message={errors.confirmPassword.message}/>
              )}
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              className={`w-full bg-primary text-2xl text-white font-semibold py-2 my-8 rounded-3xl transition
                ${
                    loading ? "cursor-not-allowed" 
                    : "cursor-pointer hover:bg-accent hover:text-black"
                  }
              `}
              disabled={isSubmitting}
            >
              {loading ? "Resetting password..." : "Reset password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgetPassForm;
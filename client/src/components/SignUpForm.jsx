import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FcGoogle} from "react-icons/fc";
import {FaFacebook} from "react-icons/fa6";
import {ReCAPTCHA} from "react-google-recaptcha";

// create schemas for validating each steps
const step1Schema = z.object({
    email: z.email("Email is not valid"),
});

const step2Schema = z.object({
    otp: z
        .string()
        .min(1, "OTP is required")
        .min(6, "OTP must be 6 numbers")
        .max(6, "OTP phải be 6 numbers")
        .regex(/^\d+$/, "OTP only contains numbers"),
});

const step3Schema = z.object({
    username: z.string().min(1, "Username is required").min(6, "Username must be at least 6 characters"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address: z.string().min(1, "Address is required"),
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

    // update step state
    const nextStep = () => {setStep(step + 1);};
    const prevStep = () => {setStep(step - 1);};

    // get current validate schema
    const currentSchema = step === 1 ? step1Schema : (step === 2 ? step2Schema : step3Schema);
    // validate data
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(currentSchema),
    });

    // send data
    const onSubmit = (data) => {
        if (step === 1){
            console.log("Step 1 data: ", data);
            // backend
            nextStep();
        } else if (step === 2) {
            console.log("Step 2: ", data);
            // backend
            nextStep();
        } else {
            console.log("Step 3 data: ", data);
            // backend
        }
    }

    return (
        <div className="bg-[#24232A] flex overflow-hidden rounded-2xl shadow-2xl">
            <div className="w-full p-10 flex flex-col justify-center h-full">
                <h2 className="text-5xl text-center font-bold mb-8">Create your account</h2>

                {/* step 1 */}
                {step == 1 && 
                (<div className="space-y-6">
                    {/* top part */}
                    <div>
                        <div>
                            <label htmlFor="email" className="block text-3xl mb-1">Email</label>
                            <input 
                                className={`w-full rounded-md p-2 text-black text-2xl bg-white ${errors.username ? "border-red-500" : "border-gray-500"} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                type="email" 
                                id="email" 
                                placeholder="example@gmail.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2">
                                    {errors.email.message}
                                </div>
                            )}
                        </div>
                        <button onClick={handleSubmit(onSubmit)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-2xl text-white font-semibold py-2 mt-8 rounded-3xl transition cursor-pointer">Next</button>
                        <p className="text-lg my-4 text-gray-300">Already have an account?{" "}
                            <a onClick={() => navigate("/signin")} className="text-yellow-400 hover:underline cursor-pointer">Sign In</a>
                        </p>
                    </div>

                    {/* middle part */}
                    <div className="flex items-center justify-center my-10 w-full relative">
                        <hr className="grow border-gray-300" />
                        <span className="absolute px-4 text-3xl bg-[#24232A] text-gray-200">or</span>
                    </div>

                    {/* bottom part */}
                    <div>
                        <div className="flex flex-col justify-center items-center">
                            <button className="w-3/4 py-2 px-4 mb-8 text-2xl flex items-center justify-center gap-2 border border-gray-200 rounded-3xl hover:bg-gray-700 transition cursor-pointer"> <FcGoogle size={30}></FcGoogle> Continue with Google</button>
                            <button className="w-3/4 py-2 px-4 text-2xl flex items-center justify-center gap-2 border border-gray-200 rounded-3xl hover:bg-gray-700 transition cursor-pointer"> <FaFacebook size={30} color="blue"></FaFacebook> Continue with Facebook</button>
                        </div>
                    </div>
                </div>)}

                {/* step 2 */}
                {step == 2 && 
                (<div className="space-y-6 text-center">
                    <p className="text-3xl">Verify your email</p>
                    <p className="text-lg text-gray-300 mb-6">We have sent an OTP to your email</p>
                    <div className="flex justify-center gap-7 mb-6">
                        {[1,2,3,4,5,6].map((i) => (
                            <input
                                className="w-10 h-12 text-center text-black font-bold rounded-md bg-white outline-none focus:ring-2 focus:ring-orange-500" 
                                key={i} 
                                type="text" 
                                maxLength={1}/>
                        ))}
                    </div>
                    {errors.otp && (
                        <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2">
                            {errors.otp.message}
                        </div>
                    )}
                    <div className="flex flex-col justify-center items-center">
                        <button 
                            className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-2xl text-white font-semibold py-2 mt-8 rounded-3xl transition cursor-pointer"
                            onClick={nextStep}
                        >Next</button>
                        <button 
                            className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-2xl text-white font-semibold py-2 mt-8 rounded-3xl transition cursor-pointer"
                            onClick={prevStep}
                        >Go back</button>
                    </div>
                </div>)}

                {/* step 3 */}
                {step == 3 &&
                (<div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-1 text-3xl">Username</label>
                        <input
                            className={`w-full rounded-md p-2 text-black text-2xl bg-white ${errors.username ? "border-red-500" : "border-gray-500"} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                            type="text" 
                            id="username"
                            placeholder="Enter username"
                            {...register("username")}
                        />
                        {errors.username && (
                            <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2">
                                {errors.username.message}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <div>
                            <label htmlFor="firstname" className="block mb-1 text-3xl">First name</label>
                            <input 
                                className={`w-full rounded-md p-2 text-black text-2xl bg-white ${errors.username ? "border-red-500" : "border-gray-500"} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                type="text" 
                                id="firstname"
                                placeholder="First name"
                                {...register("firstName")}
                            />
                            {errors.firstName && (
                                <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2">
                                    {errors.firstName.message}
                                </div>
                            )}
                        </div>
                        <div className="flex-1/2">
                            <label htmlFor="lastname" className="block mb-1 text-3xl">Last name</label>
                            <input
                                className={`w-full rounded-md p-2 text-black text-2xl bg-white ${errors.username ? "border-red-500" : "border-gray-500"} focus:outline-none focus:ring-2 focus:ring-yellow-500`} 
                                type="text" 
                                id="lastname"
                                placeholder="Last name"
                                {...register("lastName")}
                            />
                            {errors.lastName && (
                                <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2">
                                    {errors.lastName.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address" className="block mb-1 text-3xl">Adrress</label>
                        <input 
                            className={`w-full rounded-md p-2 text-black text-2xl bg-white ${errors.username ? "border-red-500" : "border-gray-500"} focus:outline-none focus:ring-2 focus:ring-yellow-500`} 
                            type="text" 
                            id="address"
                            placeholder="Enter your address"
                            {...register("address")}
                        />
                        {errors.address && (
                            <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2">
                                {errors.address.message}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <div>
                            <label htmlFor="password" className="block mb-1 text-3xl">Password</label>
                            <input 
                                className={`w-full rounded-md p-2 text-black text-2xl bg-white ${errors.username ? "border-red-500" : "border-gray-500"} focus:outline-none focus:ring-2 focus:ring-yellow-500`} 
                                type="password" 
                                id="password"
                                placeholder="Enter your password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2">
                                    {errors.password.message}
                                </div>
                            )}
                        </div>
                        <div className="flex-1/2">
                            <label htmlFor="confirm-password" className="block mb-1 text-3xl">Confirm password</label>
                            <input
                                className={`w-full rounded-md p-2 text-black text-2xl bg-white ${errors.username ? "border-red-500" : "border-gray-500"} focus:outline-none focus:ring-2 focus:ring-yellow-500`}  
                                type="password" 
                                id="confirm-password"
                                placeholder="Confirm your password"
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2">
                                    {errors.confirmPassword.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <button onClick={handleSubmit(onSubmit)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-2xl text-white font-semibold py-2 my-8 rounded-3xl transition cursor-pointer">Register</button>
                </div>)}
            </div>
        </div>
    );
}

export default SignUpForm;
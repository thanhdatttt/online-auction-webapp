import {ReCAPTCHA} from "react-google-recaptcha";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FcGoogle} from "react-icons/fc";
import {FaFacebook} from "react-icons/fa6";

// create schema for validate
const signInSchema = z.object({
    username: z.string()
                .min(1, "Please enter username")
                .min(6, 'Username must at least 6 characters'),
    password: z.string()
                .min(1, "Please enter password")
                .min(6, 'Password must at least 6 characters'),
});

const SignInForm = () => {
    // validate form
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(signInSchema),
    });

    // send data to server
    const onSubmit = (data) => {
        console.log(data);
        // backend
    }

    return (
        <div className="bg-[#24232A] flex overflow-hidden rounded-2xl shadow-2xl">
            {/* left part */}
            <div className="w-1/2 p-10 flex flex-col justify-center">
                {/* title */}
                <h2 className="text-5xl font-semibold mb-6">Sign in</h2>
                {/* sign in form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-1 text-2xl">Username</label>
                        <input 
                            className={`w-full rounded-md p-2 text-black bg-white ${errors.username ? "border-red-500" : "border-gray-500"} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                            type="text" 
                            id="username"
                            placeholder="Username"
                            {...register("username")}
                        />
                        {errors.username && (
                            <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2">
                                {errors.username.message}
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-2xl">Password</label>
                        <input 
                            className={`w-full rounded-md p-2 text-black bg-white ${errors.password ? "border-red-500" : "border-gray-500"} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                            type="password"
                            id="password" 
                            placeholder="Password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2">
                                {errors.password.message}
                            </div>
                        )}
                    </div>
                    <div className="text-right mt-1">
                        <a className="text-lg text-gray-300 hover:underline cursor-pointer">Forgot password?</a>
                    </div>
                    <button type="submit" className="w-full bg-yellow-500 text-3xl text-white font-semibold rounded-3xl py-2 mt-4 hover:bg-yellow-600 transition cursor-pointer">Sign in</button>
                    <p className="text-lg mt-3 text-gray-300">Don't have an account?{" "}
                        <a className="text-yellow-400 hover:underline cursor-pointer">Sign up</a>
                    </p>
                </form>
            </div>
            
            <div className="flex items-center justify-center w-16 relative">
                <div className="w-px h-3/4 bg-gray-300"></div>
                <span className="absolute bottom-50 px-2 text-2xl text-gray-200">OR</span>
            </div>

            {/* right part */}
            <div className="w-1/2 p-10 flex flex-col justify-center">
                <h1 className="text-7xl font-serif italic mb-4 text-center text-white">Auctiz</h1>
                <p className="text-2xl text-center leading-relaxed mb-4">Your gateway to thousands of exciting auctions. Sign in and place your bid!</p>
                <div>
                    <button className="w-full p-2 mb-8 text-3xl flex items-center justify-center gap-2 border border-gray-200 rounded-3xl hover:bg-gray-700 transition cursor-pointer"> <FcGoogle size={30}></FcGoogle> Continue with Google</button>
                    <button className="w-full p-2 text-3xl flex items-center justify-center gap-2 border border-gray-200 rounded-3xl hover:bg-gray-700 transition cursor-pointer"> <FaFacebook size={30} color="blue"></FaFacebook> Continue with Facebook</button>
                </div>
            </div>
        </div>
    );
}

export default SignInForm;
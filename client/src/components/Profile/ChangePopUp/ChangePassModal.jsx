import { useAuthStore } from "../../../stores/useAuth.store.js";
import { useUserStore } from "../../../stores/useUser.store.js";
import { regex } from "../../../utils/regex.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ChangeModalLayout from "./ChangeModalLayout.jsx";
import Divider from "../Divider.jsx";
import z from "zod";

// password schema
const passSchema = z.object({
  oldPassword: z
    .string()
    .min(1, "Please enter your password")
    .min(8, "Password must be at least 8 characters"),
  newPassword: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      regex.password,
      "Password must contain uppercase, lowercase, numbers and special characters"
    ),
  confirmPassword: z.string().min(1, "Confirm your password"),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  error: "Password does not match",
  path: ["confirmPassword"],
});

const ChangePassModal = ({open, onClose}) => {
  //  get user info
  const user = useAuthStore((state) => state.user);

  // get api
  const {changePassword} = useUserStore();

  // validation
  const {register, handleSubmit, watch, reset, setError, clearErrors, formState: {errors}} = useForm({
    resolver: zodResolver(passSchema),
  });

  // clear error when input change
  const newPassValue = watch("newPassword");
  const oldPassValue = watch("oldPassword");
  useEffect(() => {
    if (errors.root) clearErrors("root");
  }, [newPassValue, oldPassValue]);

  // clear form when close 
  const handleClose = () => {
    reset();
    onClose();
  }

  const onSubmit = async (data) => {
    try {
      await changePassword(data);
      handleClose();
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "An error occured in the system",
      });
    }
  }

  return (
    <ChangeModalLayout open={open} onClose={handleClose} onSubmit={handleSubmit(onSubmit)} title={"Change Password"}>
      {/* current password */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Current Password</label>
        <input 
          type="text" 
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Enter your current password"
          {...register("oldPassword")}
        />

        {/* form error */}
        {errors.oldPassword && 
        <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
          {errors.oldPassword.message}
        </div>
        }
        {/* pass error at server */}
        {errors.root && 
        <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
          {errors.root.message}
        </div>
        }
      </div>
      <Divider/>

      {/* new password */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">New Password</label>
        <input 
          type="text" 
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Enter new password"
          {...register("newPassword")}
        />
        {/* form error */}
        {errors.newPassword && 
        <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
          {errors.newPassword.message}
        </div>
        }
      </div>
      <Divider/>

      {/* confirm password */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Confirm New Password</label>
        <input 
          type="text"
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Confirm new password"
          {...register("confirmPassword")}
        />
        {/* form error */}
        {errors.confirmPassword && 
        <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
          {errors.confirmPassword.message}
        </div>
        }
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangePassModal;
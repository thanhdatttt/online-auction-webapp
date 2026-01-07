import { useUserStore } from "../../../stores/useUser.store.js";
import { regex } from "../../../utils/regex.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Error from "../../Error.jsx";
import ChangeModalLayout from "./ChangeModalLayout.jsx";
import Divider from "../Divider.jsx";

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
        <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">Current Password</label>
        <input 
          type="password" 
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Enter your current password"
          {...register("oldPassword")}
        />

        {/* form error */}
        {errors.oldPassword && 
        <Error message={errors.oldPassword.message}/>
        }
        {/* pass error at server */}
        {errors.root && 
        <Error message={errors.root.message}/>
        }
      </div>
      <Divider/>

      {/* new password */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">New Password</label>
        <input 
          type="password" 
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Enter new password"
          {...register("newPassword")}
        />
        {/* form error */}
        {errors.newPassword && 
        <Error message={errors.newPassword.message}/>
        }
      </div>
      <Divider/>

      {/* confirm password */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">Confirm New Password</label>
        <input 
          type="password"
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Confirm new password"
          {...register("confirmPassword")}
        />
        {/* form error */}
        {errors.confirmPassword && 
        <Error message={errors.confirmPassword.message}/>
        }
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangePassModal;
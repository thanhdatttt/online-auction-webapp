import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../../stores/useAuth.store.js";
import { useUserStore } from "../../../stores/useUser.store.js";
import { useEffect } from "react";
import z from "zod";
import Error from "../../Error.jsx";
import ChangeModalLayout from "./ChangeModalLayout.jsx";
import Divider from "../Divider.jsx";

// email modal schema
const createEmailSchema = (currentEmail) => z.object({
  newEmail: z.string().min(1, "Email is required").email("Email is invalid"),
  confirmEmail: z.string().min(1, "Confirm new email").email("Email is invalid"),
})
.refine((data) => data.newEmail === data.confirmEmail, {
  message: "Email does not match",
  path: ["confirmEmail"],
})
.refine((data) => data.newEmail !== currentEmail, {
  message: "New email must be different from current email",
  path: ["newEmail"],
});

const ChangeEmailModal = ({open, onClose}) => {
  // get user info
  const user = useAuthStore((state) => state.user);

  // get api
  const { changeEmail } = useUserStore();

  // validation
  const {register, handleSubmit, watch, setError, clearErrors, reset, formState:{errors}} = useForm({
    resolver: zodResolver(createEmailSchema(user.email)),
  });

  // clear errors when input change
  const newEmailValue = watch("newEmail");
  useEffect(() => {
    if (errors.root) clearErrors("root");
  }, [newEmailValue]);

  // clear form when close 
  const handleClose = () => {
    reset();
    onClose();
  }

  // send data to server
  const onSubmit = async (data) => {
    try {
      await changeEmail(data);
      handleClose();
    } catch (err) {
      // get error from backend
      setError("root", {
        message: err.response?.data?.message || "An error occured in the system",
      });
    }
  }

  return (
    <ChangeModalLayout open={open} onClose={handleClose} title={"Change Email Address"} onSubmit={handleSubmit(onSubmit)}>
      {/* current email */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">Current Email</label>
        <p className="text-2xl">{user.email}</p>
      </div>
      <Divider/>

      {/* New email */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">New Email</label>
        <input 
          type="email" 
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Enter your new email"
          {...register("newEmail")}
        />

        {/* form error */}
        {errors.newEmail && 
        <Error message={errors.newEmail.message}/>
        }
        {/* email error at server */}
        {errors.root && 
        <Error message={errors.root.message}/>
        }
      </div>
      <Divider/>

      {/* confirm email */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">Confirm Email</label>
        <input 
          type="email" 
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Confirm your new email"
          {...register("confirmEmail")}
        />
        {errors.confirmEmail && 
        <Error message={errors.confirmEmail.message}/>
        }
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangeEmailModal;
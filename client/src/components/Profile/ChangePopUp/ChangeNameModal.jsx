import { useAuthStore } from "../../../stores/useAuth.store.js";
import { useUserStore } from "../../../stores/useUser.store.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { regex } from "../../../utils/regex.js";
import z from "zod";
import Error from "../../Error.jsx";
import ChangeModalLayout from "./ChangeModalLayout.jsx";
import Divider from "../Divider.jsx";

// name schema
const nameSchema = z.object({
  newFirstName: z
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
    })
    .optional(), 
  newLastName: z
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
    })
    .optional(),
});

const ChangeNameModal = ({open, onClose}) => {
  // get user info
  const user = useAuthStore((state) => state.user);

  // get api
  const {changeName} = useUserStore();

  // validation
  const {register, handleSubmit, watch, reset, setError, clearErrors, formState: {errors}} = useForm({
    resolver: zodResolver(nameSchema),
  });

  // clear errors when input change
  const newFirstNameValue = watch("newFirstName");
  const newLastNameValue = watch("newLastName");
  useEffect(() => {
    if (errors.root) clearErrors("root");
  }, [newFirstNameValue, newLastNameValue]);

  // clear form when close 
  const handleClose = () => {
    reset();
    onClose();
  }

  // send data to server
  const onSubmit = async (data) => {
    try {
      await changeName(data);
      handleClose();
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "An error occured in the system"
      });
    }
  }

  return (
    <ChangeModalLayout open={open} onClose={handleClose} onSubmit={handleSubmit(onSubmit)} title={"Change Full Name"}>
      {/* current fullname */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">Fullname</label>
        <p className="text-2xl">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstname ? `${user.firstName}` : user.lastName ? `${user.lastName}` : "Unknown"}</p>
      </div>
      <Divider/>

      <div className="flex items-center justify-center gap-3">
        {/* first name */}
        <div>
          <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">First Name</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
            placeholder="Enter your first name"
            {...register("newFirstName")}
          />

          {/* form error */}
          {errors.newFirstName && 
          <Error message={errors.newFirstName.message}/>
          }
          {/* name error at server */}
          {errors.root &&  
          <Error message={errors.root.message}/>
          }
        </div>
        <Divider/>

        {/* last name */}
        <div>
          <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">Last name</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
            placeholder="Enter your last name"
            {...register("newLastName")}
          />

          {/* form error */}
          {errors.newLastName && 
          <Error message={errors.newLastName.message}/>
          }
        </div>
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangeNameModal;
import { useAuthStore } from "../../../stores/useAuth.store.js";
import { useUserStore } from "../../../stores/useUser.store.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Error from "../../Error.jsx";
import ChangeModalLayout from "./ChangeModalLayout.jsx";
import Divider from "../Divider.jsx";

// birth schema
const birthSchema = z.object({
  newBirth:  z
    .string()
    .min(1, "Birth date is required")
    .refine((value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
    }, "Birth date is invalid")
    .refine((value) => {
        const today = new Date();
        return new Date(value) <= today;
    }, "Birth date cannot be in the future")
    .refine((value) => {
      const birth = new Date(value);
      const today = new Date();
      const age =
        today.getFullYear() -
        birth.getFullYear() -
        (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);

      return age >= 18;
    }, "You must be at least 18 years old"),
});

const ChangeBirthModal = ({open, onClose}) => {
  // get user info
  const user = useAuthStore((state) => state.user);
  const curBirth = user.birth ? new Date(user.birth) : null;

  // get api
  const {changeBirth} = useUserStore();

  // validation
  const {register, handleSubmit, watch, reset, setError, clearErrors, formState: {errors}} = useForm({
    resolver: zodResolver(birthSchema),
  });

  // clear error when input change
  const newBirthValue = watch("newBirth");
  useEffect(() => {
    if (errors.root) clearErrors("root");
  }, [newBirthValue]);

  // clear form when close 
  const handleClose = () => {
    reset();
    onClose();
  }

  // send data to server
  const onSubmit = async (data) => {
    try {
      await changeBirth(data);
      handleClose();
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "An error occured in the system"
      });
    }
  }

  return (
    <ChangeModalLayout open={open} onClose={handleClose} onSubmit={handleSubmit(onSubmit)} title={"Change Birth Date"}>
      {/* current birthdate */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">Current Birth Date</label>
        <p className="text-2xl">{curBirth ? curBirth.toLocaleDateString() : "Unknown"}</p>
      </div>
      <Divider/>

      {/* new birthdate */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-500 font-semibold">New Birth Date</label>
         <input
              type="date"
              {...register("newBirth")}
              className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          />
        {errors.newBirth &&
        <Error message={errors.newBirth.message}/>
        }
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangeBirthModal;
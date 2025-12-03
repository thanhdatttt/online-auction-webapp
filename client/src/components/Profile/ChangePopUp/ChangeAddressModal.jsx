import { useAuthStore } from "../../../stores/useAuth.store.js";
import { useUserStore } from "../../../stores/useUser.store.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { regex } from "../../../utils/regex.js";
import z from "zod";
import Error from "../../Error.jsx";
import ChangeModalLayout from "./ChangeModalLayout.jsx";
import Divider from "../Divider.jsx";

// address schema
const addressSchema = z.object({
  newAddress: z
    .string()
    .min(1, "Address is required")
    .max(150, "Address must be under 150 characters")
    .regex(regex.address, "Address is invalid")
    .transform((val) => val.replace(/\s+/g, " ")),
});

const ChangeAddressModal = ({open, onClose}) => {
  // get user info
  const user = useAuthStore((state) => state.user);

  // get api
  const {changeAddress} = useUserStore();

  // validation
  const {register, handleSubmit, watch, reset, setError, clearErrors, formState: {errors}} = useForm({
    resolver: zodResolver(addressSchema),
  });

  // clear error when input change
  const newAddressValue = watch("newAddress");
  useEffect(() => {
    if (errors.root) clearErrors("root");
  }, [newAddressValue]);

  // clear form when close 
  const handleClose = () => {
    reset();
    onClose();
  }

  // send data to server
  const onSubmit = async (data) => {
    try {
      await changeAddress(data);
      handleClose();
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "An error occured in the system"
      });
    }
  }
  
  return (
    <ChangeModalLayout open={open} onClose={handleClose} onSubmit={handleSubmit(onSubmit)} title={"Change Address"}>
      {/* current address */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Current Address</label>
        <p className="text-2xl">{user.address ? user.address : "Unknown"}</p>
      </div>
      <Divider/>

      {/* new address */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">New Address</label>
        <input 
          type="text" 
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Enter your new address"
          {...register("newAddress")}
        />
        {/* form error */}
        {errors.newAddress && 
        <Error message={errors.newAddress.message}/>
        }
        {/* address error at server */}
        {errors.root &&  
        <Error message={errors.root.message}/>
        }
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangeAddressModal;
import Divider from "../Divider.jsx";
import ChangeModalLayout from "./ChangeModalLayout.jsx";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../../stores/useAuth.store.js";

const ChangeEmailModal = ({open, onClose}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <ChangeModalLayout open={open} onClose={onClose} title={"Change Email Address"}>
        {/* current email */}
        <div>
          <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Current Email</label>
          <p className="text-2xl">{user.email}</p>
        </div>
        <Divider/>

        {/* New email */}
        <div>
          <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">New Email</label>
          <input 
            type="email" 
            className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
            placeholder="Enter your new email"
          />
        </div>
        <Divider/>

        {/* confirm email */}
        <div>
          <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Confirm Email</label>
          <input 
            type="email" 
            className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
            placeholder="Confirm your new email"
          />
        </div>
        <Divider/>

        {/* confirm password */}
        <div>
          <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Password</label>
          <input 
            type="password"
            className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
            placeholder="Enter your password"
          />
        </div>
        <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangeEmailModal;
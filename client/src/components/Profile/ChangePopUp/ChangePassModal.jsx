import { useAuthStore } from "../../../stores/useAuth.store.js";
import ChangeModalLayout from "./ChangeModalLayout.jsx";
import Divider from "../Divider.jsx";

const ChangePassModal = ({open, onClose}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <ChangeModalLayout open={open} onClose={onClose} title={"Change Password"}>
      {/* current password */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Current Password</label>
        <input 
          type="password" 
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Enter your current password"
        />
      </div>
      <Divider/>

      {/* new password */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">New Password</label>
        <input 
          type="password" 
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Enter new password"
        />
      </div>
      <Divider/>

      {/* confirm password */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Confirm New Password</label>
        <input 
          type="password"
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Confirm new password"
        />
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangePassModal;
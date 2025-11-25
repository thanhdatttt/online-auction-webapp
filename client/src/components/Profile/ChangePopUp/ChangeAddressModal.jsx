import { useAuthStore } from "../../../stores/useAuth.store.js";
import ChangeModalLayout from "./ChangeModalLayout.jsx";
import Divider from "../Divider.jsx";

const ChangeAddressModal = ({open, onClose}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <ChangeModalLayout open={open} onClose={onClose} title={"Change Address"}>
      {/* current fullname */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Current Address</label>
        <p className="text-2xl">{user.address ? user.address : "Unknown"}</p>
      </div>
      <Divider/>

      {/* address */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">New Address</label>
        <input 
          type="text" 
          className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
          placeholder="Enter your new address"
        />
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangeAddressModal;
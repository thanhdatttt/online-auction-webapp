import { useAuthStore } from "../../../stores/useAuth.store.js";
import ChangeModalLayout from "./ChangeModalLayout.jsx";
import Divider from "../Divider.jsx";

const ChangeNameModal = ({open, onClose}) => {
  const user = useAuthStore((state) => state.user);
  
  return (
    <ChangeModalLayout open={open} onClose={onClose} title={"Change Full Name"}>
      {/* current fullname */}
      <div>
        <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Fullname</label>
        <p className="text-2xl">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstname ? `${user.firstName}` : user.lastName ? `${user.lastName}` : "Unknown"}</p>
      </div>
      <Divider/>

      <div className="flex items-center justify-center gap-3">
        {/* first name */}
        <div>
          <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">First Name</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
            placeholder="Enter your first name"
          />
        </div>
        <Divider/>

        {/* last name */}
        <div>
          <label className="text-2xl uppercase tracking-wide text-gray-300 font-semibold">Last name</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 bg-gray-400 text-xl rounded focus:outline-primary"
            placeholder="Enter your last name"
          />
        </div>
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangeNameModal;
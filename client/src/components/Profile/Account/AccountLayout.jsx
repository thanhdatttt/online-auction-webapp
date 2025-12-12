import { useAuthStore } from "../../../stores/useAuth.store.js";
import { useState } from "react";
import Divider from "../Divider.jsx";
import ProfileRow from "./AccountRow.jsx";
import Avatar from "./Avatar.jsx";
import RequestRoleButton from "./RequestRoleButton.jsx";
import ChangeEmailModal from "../ChangePopUp/ChangeEmailModal.jsx";
import ChangeNameModal from "../ChangePopUp/ChangeNameModal.jsx";
import ChangeAddressModal from "../ChangePopUp/ChangeAddressModal.jsx";
import ChangePassModal from "../ChangePopUp/ChangePassModal.jsx";
import ChangeAvatarModal from "../ChangePopUp/ChangeAvatarModal.jsx";
import ChangeBirthModal from "../ChangePopUp/ChangeBirthModal.jsx";

const ProfileSection = () => {
  // user info
  const user = useAuthStore((state) => state.user);
  const date = user.birth ? new Date(user.birth) : null;

  // popup modal state
  const [openModal, setOpenModal] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  // handle popup function
  const handleChange = (field) => {
    setCurrentField(field);
    setOpenModal(true);
  }

  // handle avatar upload
  const onUpload = (e) => {
    const file = e.target.files[0];
    if (!file)
      return;
  }

  return (
    <div>
      {/* content */}
      <h1 className="text-5xl mb-6">Account</h1>
      <Divider/>
      
      <div className="flex justify-between items-center pr-6">
        <ProfileRow
          label="Name"
          value={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstname ? `${user.firstName}` : user.lastName ? `${user.lastName}` : "Unknown"}
          canChange={true}
          onChangeClick={() => handleChange("name")}
        />

        <Avatar user={user} canChange={true} onChangeClick={() => handleChange("avatar")}/>
      </div>
      <Divider/>

      <div className="flex flex-col justify-between pb-4">
        <ProfileRow
          label="Role"
          value={user.role}
          description={user.role === "bidder" ? "Upgrade to seller" : "You are now seller"}
        />

        <div>
          {user.role === "bidder" && (
            <RequestRoleButton/>
          )}
        </div>
      </div>
      <Divider/>

      <ProfileRow
        label="Username"
        value={user.username}
        description="Your username cannot be changed"
      />
      <Divider/>

      <ProfileRow
        label="Email"
        value={user.email}
        description="We'll contact you via email with updates about your bids and transactions"
        canChange={true}
        onChangeClick={() => handleChange("email")}
      />
      <Divider/>

      {!user.providers && (
      <div>
        <ProfileRow
          label="Password"
          canChange={true}
          onChangeClick={() => handleChange("password")}
        />
        <Divider/>
      </div>
      )}

      <ProfileRow
        label="Birth"
        value={date? date.toLocaleDateString() : "Unknown"}
        canChange={true}
        onChangeClick={() => handleChange("birth")}
      />
      <Divider/>

      <ProfileRow
        label="Address"
        value={user.address ? user.address : "Unknown"}
        canChange={true}
        onChangeClick={() => handleChange("address")}
      />

      {/* popup */}
      {currentField === "email" && (
        <ChangeEmailModal open={openModal} onClose={() => setOpenModal(false)} />
      )}
      {currentField === "password" && (
        <ChangePassModal open={openModal} onClose={() => setOpenModal(false)} />
      )}
      {currentField === "name" && (
        <ChangeNameModal open={openModal} onClose={() => setOpenModal(false)} />
      )}
      {currentField === "address" && (
        <ChangeAddressModal open={openModal} onClose={() => setOpenModal(false)} />
      )}
      {currentField === "birth" && (
        <ChangeBirthModal open={openModal} onClose={() => setOpenModal(false)} />
      )}
      {currentField === "avatar" && (
        <ChangeAvatarModal open={openModal} onClose={() => setOpenModal(false)} onUpload={onUpload}/>
      )}
    </div>
  );
}

export default ProfileSection;
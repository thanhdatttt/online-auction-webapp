import { useAuthStore } from "../../stores/useAuth.store.js";
import Divider from "./Divider.jsx";
import ProfileRow from "./ProfileRow.jsx";

const ProfileSection = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
        <h1>Account</h1>
        <Divider/>

        <ProfileRow
          label="Name"
          value="Drake Diddy"
          actionText="Change"
        />
        <Divider/>

        <ProfileRow
          label="Username"
          value="Dreckiez"
          description="Your username cannot be changed"
        />
        <Divider/>

        <ProfileRow
          label="Email"
          value="ngaylo10lan@gmail.com"
          description="We'll contact you via email with updates about your bids and transactions"
          actionText="Change"
        />
        <Divider/>

        <ProfileRow
          label="Password"
          value="********"
          actionText="Change"
        />
        <Divider/>

        <ProfileRow
          label="Address"
          value="36/69, Railway Street, Thanh Hoa City"
          actionText="Change"
        />
    </div>
  );
}

export default ProfileSection;
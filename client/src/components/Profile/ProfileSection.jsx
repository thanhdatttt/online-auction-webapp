import { useAuthStore } from "../../stores/useAuth.store.js";
import Divider from "./Divider.jsx";
import ProfileRow from "./ProfileRow.jsx";

const ProfileSection = ({activeSection}) => {
  const user = useAuthStore((state) => state.user);

  const date = user.birth ? new Date(user.birth) : null;

  return (
    <div>
        <h1 className="text-5xl mb-6">Account</h1>
        <Divider/>

        <ProfileRow
          label="Name"
          value={user.firstName? user.firstName : "Unknown"}
          canChange={true}
        />
        <Divider/>

        <ProfileRow
          label="Role"
          value={user.role}
          description={user.role === "bidder" ? "Upgrade to seller" : "You are now seller"}
        />
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
        />
        <Divider/>

        <ProfileRow
          label="Password"
          value="********"
          canChange={true}
        />
        <Divider/>

        <ProfileRow
          label="Birth"
          value={date? date.toLocaleDateString() : "Unknown"}
          canChange={true}
        />
        <Divider/>

        <ProfileRow
          label="Address"
          value={user.address ? user.address : "Unknown"}
          canChange={true}
        />
    </div>
  );
}

export default ProfileSection;
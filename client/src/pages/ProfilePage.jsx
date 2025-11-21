import { useAuthStore } from "../stores/useAuth.store.js";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      {user?.username}
    </div>
  );
};

export default ProfilePage;
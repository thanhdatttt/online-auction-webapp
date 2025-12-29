import { useUserStore } from "../../../stores/useUser.store.js";

const RequestRoleButton = () => {
  const { loading, requestUpdateRole } = useUserStore();

  const handleRquest = async () => {
    try {
      await requestUpdateRole();
    } catch (err) {
      throw err;
    }
  }

  return (
    <button onClick={handleRquest} disabled={loading} className="bg-primary text-xl text-lighter px-4 py-2 rounded hover:bg-accent hover:text-black transition cursor-pointer">
      Upgrade to seller
    </button>
  );
}

export default RequestRoleButton;
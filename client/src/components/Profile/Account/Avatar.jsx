import { FaRegCircleUser } from "react-icons/fa6";

const Avatar = ({
  user,
  canChange=false,
  onChangeClick
}) => {
  return (
    <div className="py-5 flex flex-col items-center justify-center">
      <p className="uppercase text-2xl text-gray-500 mb-4">Avatar</p>
      {user?.avatar_url ? <img src={user.avatar_url} className="w-20 h-20 rounded-full border-2 border-gray-500"></img> : <FaRegCircleUser className="w-20 h-20"/>}

      {canChange && (
      <button onClick={onChangeClick} className="text-primary text-xl mt-4 hover:underline cursor-pointer">
        Change
      </button>)}
    </div>
  );
}

export default Avatar;
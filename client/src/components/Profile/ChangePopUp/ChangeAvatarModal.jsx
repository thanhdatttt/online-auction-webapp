import { useAuthStore } from '../../../stores/useAuth.store.js';
import { FaRegCircleUser } from 'react-icons/fa6';
import ChangeModalLayout from './ChangeModalLayout.jsx';
import Divider from '../Divider.jsx';

const ChangeAvatarModal = ({open, onClose, onUpload}) => {
  // get user info
  const user = useAuthStore((state) => state.user);

  return (
    <ChangeModalLayout open={open} onClose={onClose} title={"Change Avatar"}>
      <div className="flex flex-col items-center justify-center gap-4">
        {/* current avatar */}
        <div className='flex flex-col items-center justify-center'>
          {user?.avatar_url ? <img src={user.avatar_url} className="w-50 h-50 rounded-full border-2 border-gray-500"></img> : <FaRegCircleUser className="w-50 h-50"/>}
          <p className="text-2xl">Current Avatar</p>
        </div>

        {/* select new avatar */}
        <div className="mb-4 text-2xl">
          <label className="cursor-pointer bg-primary text-light px-4 py-2 rounded hover:bg-accent transition">
            Upload Image
            <input 
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={onUpload}
            />
          </label>
        </div>
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangeAvatarModal;
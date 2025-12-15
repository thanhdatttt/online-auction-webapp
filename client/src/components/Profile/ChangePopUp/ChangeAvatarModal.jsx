import { useAuthStore } from '../../../stores/useAuth.store.js';
import { useUserStore } from '../../../stores/useUser.store.js';
import { toast } from 'sonner';
import { FaRegCircleUser } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import ChangeModalLayout from './ChangeModalLayout.jsx';
import Divider from '../Divider.jsx';
import Error from '../../Error.jsx';

// avatar schema
const avatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be smaller than 5MB",
    }),
});

const ChangeAvatarModal = ({open, onClose}) => {
  // get user info
  const user = useAuthStore((state) => state.user);

  // get api
  const {changeAvatar} = useUserStore();

  // validation
  const {register, setValue, handleSubmit, formState: { errors }, reset} = useForm({
    resolver: zodResolver(avatarSchema)
  });

  // preview state
  const [previewUrl, setPreviewUrl] = useState(user.avatar_url);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    if (open) {
      setPreviewUrl(user.avatar_url);
      setSelectedFile(null);
    }
  }, [open, user.avatar_url]);
  useEffect(() => {
    return () => previewUrl && URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // clear form when close 
  const handleClose = () => {
    reset();
    onClose();
  }

  // change avatar
  const onUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setValue("avatar", file);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occured in the system");
    }
  }

  // send data to server
  const onSubmit = async () => {
    try {
      await changeAvatar(selectedFile);
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occured in the system");
    }
  }

  return (
    <ChangeModalLayout open={open} onClose={handleClose} onSubmit={handleSubmit(onSubmit)} title={"Change Avatar"}>
      <div className="flex flex-col items-center justify-center gap-4">
        {/* current avatar */}
        <div className='flex flex-col items-center justify-center'>
          {previewUrl ? <img src={previewUrl} className="w-50 h-50 rounded-full border-2 border-gray-500"></img> : <FaRegCircleUser className="w-50 h-50"/>}
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
              {...register("avatar")}
              onChange={onUpload}
            />
            {errors.avatar && (
              <Error message={errors.avatar.message}/>
            )}
          </label>
        </div>
      </div>
      <Divider/>
    </ChangeModalLayout>
  );
}

export default ChangeAvatarModal;
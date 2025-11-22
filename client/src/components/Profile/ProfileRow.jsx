const ProfileRow = ({
  label,
  value,
  description,
  canChange=false
}) => {
  return (
    <div className="py-5">
      <p className="uppercase text-2xl text-gray-500 mb-4">{label}</p>

      <div className="flex justify-between items-center">
        <p className="text-black text-xl font-semibold">{value}</p>

        {description && (
          <p className="text-sm text-gray-500 hidden md:block">{description}</p>
        )}
      </div>
      
      {canChange ? <button className="text-primary text-lg mt-4 hover:underline cursor-pointer">Change</button> : ""}
    </div>
  );
}

export default ProfileRow;
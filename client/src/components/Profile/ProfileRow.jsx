const ProfileRow = ({
  label,
  value,
  description,
  actionText
}) => {
  return (
    <div>
      <p>{label}</p>

      <div>
        <div>
          <p>{value}</p>
          {actionText && (
            <button>{actionText}</button>
          )}
        </div>

        {description && (
          <p>{description}</p>
        )}
      </div>
    </div>
  );
}

export default ProfileRow;
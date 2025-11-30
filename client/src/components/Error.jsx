const Error = ({message}) => {
  return (
    <div className="bg-red-200 text-red-700 text-lg text-center mt-2 p-2 rounded-md">
      {message}
    </div>
  );
}

export default Error;
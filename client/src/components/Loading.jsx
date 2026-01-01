import {ClipLoader} from "react-spinners";

const Loading = ({message="Loading"}) => {
  return (
    <div className="mt-40 flex items-center justify-center font-bold">
      <ClipLoader size={150} aria-label={message}/>
    </div>
  );
}

export default Loading;
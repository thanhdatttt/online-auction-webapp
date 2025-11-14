import SignUpForm from "../components/SignUpForm.jsx";
import { Toaster, toast } from "sonner";
const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center h-dvh">
      <SignUpForm></SignUpForm>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default SignUpPage;

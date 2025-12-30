import {ShieldCheck, ArrowLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";

const ProfileHeader = ({username}) => {
  const navigate = useNavigate();

  return (
    <section className="pt-10 pb-4 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-600/5 -skew-x-12 transform translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button 
            onClick={() => navigate("/home")}
            className="group mb-8 inline-flex items-center space-x-2 text-primary hover:text-accent transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft size={14} className="mr-1 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-[0.3em]">
              Back to Home
            </span>
          </button>

        <div className="flex items-center space-x-3 mb-6">
          <ShieldCheck className="text-primary" size={20} />
          <span className="text-primary font-bold uppercase tracking-[0.4em] text-lg">Profile dashboard</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-lora text-white mb-8 leading-tight">
          Welcome <span className="italic font-bold text-primary">{username}</span>
        </h1>
      </div>
    </section>
  );
}

export default ProfileHeader;
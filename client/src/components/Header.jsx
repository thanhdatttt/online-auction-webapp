import {FiSearch, FiMenu, FiX} from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { useAuthStore } from "../stores/useAuth.store.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  // navigate
  const navigate = useNavigate();
  
  // auth actions
  const {logout} = useAuthStore();
  const user = useAuthStore((state) => state.user);

  // menu states
  const [dropMenu, setDropMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef();

  // close dropdown menu when click outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropMenu(false);
        setMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    // reset
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  
  // logout account 
  const handleLogout = async () => {
      try {
          await logout();
          navigate("/signin");
      } catch (err) {
          throw err;
      }
  }

  return (
    <header className="w-full bg-dark px-4 md:px-8 py-4 flex items-center justify-between relative">
      {/* logo */}
      <div className="text-lighter text-3xl md:text-5xl font-lora font-semibold cursor-pointer" onClick={() => navigate("/home")}>
        Auctiz
      </div>

      {/* search bar */}
      <div className="flex flex-1 max-w-2xs xl:max-w-xl mx-8 relative">
        <input 
          type="text" 
          placeholder="Search items"
          className="w-full bg-light text-gray-700 placeholder-gray-500 px-4 py-2 rounded-lg focus:outline-primary"
        />
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 text-xl cursor-pointer"/>
      </div>

      {/* menu */}
      <div className="hidden md:flex font-lora items-center gap-12 text-lighter text-2xl">
        {/* buttons */}
        <button className="hover:text-primary transition cursor-pointer">Categories</button>
        <button className="hover:text-primary transition cursor-pointer">Watch List</button>
        <button onClick={() => navigate("/signin")} className="bg-primary px-8 py-2 rounded-md font-semibold hover:bg-accent hover:text-black transition cursor-pointer">Sign In</button>

        {/* user */}
        <div className="relative" ref={menuRef}>
          {/* user icon */}
          <div onClick={() => setDropMenu(true)} className="flex items-center justify-center cursor-pointer">
            {user?.avatar_url ? <img src={user.avatar_url} className="w-10 h-10"></img> : <FaRegCircleUser className="w-10 h-10"/>}
          </div>

          {/* dropdown menu */}
          {dropMenu && user && (
            <div className="absolute right-0 mt-4 w-50 bg-dark shadow-lg rounded-md text-lighter font-lora font-semibold z-50 flex flex-col items-center">
              <button onClick={() => navigate("/profile")} className="w-full px-2 py-4 text-2xl hover:bg-[linear-gradient(to_right,#EA8611,#F6F7FA)] hover:text-black transition-colors">
                Profile
              </button>
              <button onClick={handleLogout} className="w-full px-2 py-4 text-2xl hover:bg-[linear-gradient(to_right,#EA8611,#F6F7FA)] hover:text-black transition-colors">
                  Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* mobile menu */}
      <button className="md:hidden text-white text-3xl" onClick={() => setMobileMenu(!mobileMenu)}>
        {mobileMenu ? <FiX/> : <FiMenu/>}
      </button>

      {/* mobile menu slide down */}
      {mobileMenu && (
        <div className="absolute top-full right-0 w-1/2 bg-dark text-lighter font-lora font-semibold flex flex-col md:hidden shadow-lg z-50">
          <button onClick={() => navigate("/signin")} className="w-full py-4 text-2xl bg-primary hover:text-black hover:bg-accent transition-colors">
            Sign In
          </button>
          <button onClick={() => navigate("/profile")} className="w-full py-4 text-2xl hover:bg-[linear-gradient(to_right,#EA8611,#F6F7FA)] hover:text-black transition-colors">
            Profile
          </button>
          <button className="w-full py-4 text-2xl hover:bg-[linear-gradient(to_right,#EA8611,#F6F7FA)] hover:text-black transition-colors">
            Categories
          </button>
          <button className="w-full py-4 text-2xl hover:bg-[linear-gradient(to_right,#EA8611,#F6F7FA)] hover:text-black transition-colors">
            Watch List
          </button>
          <button onClick={handleLogout} className="w-full py-4 text-2xl hover:bg-[linear-gradient(to_right,#EA8611,#F6F7FA)] hover:text-black transition-colors">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
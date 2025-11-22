import ProfileSection from "./ProfileSection.jsx";
import SideBar from "./SideBar.jsx";
import Header from "../Header.jsx";
import { useState } from "react";
import { useAuthStore } from "../../stores/useAuth.store.js";
import Divider from "./Divider.jsx";

const ProfileLayout = () => {
  // user info
  const user = useAuthStore((state) => state.user);

  // sections state
  const [activeSection, setActiveSection] = useState("Account");

  return (
    <div className="min-h-svh bg-light mt-20">
      <Header></Header>

      <h1 className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent text-4xl md:text-6xl font-extrabold font-lora py-6 pl-6 md:pl-12">Welcome, {user.username}</h1>
      <Divider />

      <div className="min-h-svh flex px-6 md:px-12 py-10 text-black font-lora">
        {/* side bar */}
        <SideBar activeSection={activeSection} setActiveSection={setActiveSection}></SideBar>

        {/* main content */}
        <div className="flex-1 ml-4">
          <ProfileSection activeSection={activeSection}></ProfileSection>
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
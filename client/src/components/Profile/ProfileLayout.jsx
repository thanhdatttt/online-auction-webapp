import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/useAuth.store.js";
import ProfileSection from "./Account/AccountLayout.jsx";
import WatchListSection from "./WatchList/WatchListLayout.jsx";
import ActiveBidLayout from "./ActiveBids/ActiveBidLayout.jsx";
import SideBar from "./SideBar.jsx";
import Header from "../Header.jsx";
import Divider from "./Divider.jsx";
import { useLocation } from "react-router-dom";

const ProfileLayout = () => {
  // user info
  const user = useAuthStore((state) => state.user);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const sectionParam = params.get("section");

  // map of sections
  const sections = {
    "account": <ProfileSection />,
    "watchlist": <WatchListSection />,
    "activebids": <ActiveBidLayout />,
    "auctionwon": <ProfileSection />,
    "feedbacks": <WatchListSection />,
    "payment": <ProfileSection />,
  };

  // sections state
  const [activeSection, setActiveSection] = useState("account");

  // switch section
  useEffect(() => {
    if (sectionParam && sections[sectionParam]) {
      setActiveSection(sectionParam);
    } else {
      setActiveSection("account"); // default fallback
    }
  }, [sectionParam]);

  return (
    <div className="min-h-svh bg-light mt-20">
      <Header></Header>

      <h1 className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent text-4xl md:text-6xl font-extrabold font-lora py-6 pl-6 md:pl-12">Welcome, {user.username}</h1>
      <Divider />

      <div className="min-h-svh flex flex-col lg:flex-row px-6 md:px-12 py-6 text-black font-lora">
        {/* side bar */}
        <SideBar activeSection={activeSection}></SideBar>

        {/* main content */}
        <div className="flex-1 ml-4">
          {sections[activeSection]}
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
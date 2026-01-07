import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/useAuth.store.js";
import ProfileSection from "./Account/AccountLayout.jsx";
import WatchListSection from "./WatchList/WatchListLayout.jsx";
import ActiveBidLayout from "./ActiveBids/ActiveBidLayout.jsx";
import SideBar from "./SideBar.jsx";
import { useLocation } from "react-router-dom";
import { AuctionWonLayout } from "./AuctionWon/AuctionWonLayout.jsx";
import AuctionCreatedLayout from "./AuctionCreated/AuctionCreatedLayout.jsx";
import ProfileHeader from "./ProfileHeader.jsx";
import FeedbackLayout from "./Feedback/FeedbackLayout.jsx";
const ProfileLayout = ({ isPublic = false, targetUser = null }) => {
  // user info
  const authUser = useAuthStore((state) => state.user);
  const user = isPublic ? targetUser : authUser;

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const sectionParam = params.get("section");

  // map of sections
  const sections = {
    account: <ProfileSection />,
    watchlist: <WatchListSection />,
    activebids: <ActiveBidLayout />,
    auctionwon: <AuctionWonLayout />,
    auctioncreated: <AuctionCreatedLayout />,
    feedbacks: <FeedbackLayout />,
  };

  // sections state
  const [activeSection, setActiveSection] = useState("account");

  // switch section
  useEffect(() => {
    if (!isPublic) {
      if (sectionParam && sections[sectionParam]) {
        setActiveSection(sectionParam);
      } else {
        setActiveSection("account");
      }
    }
  }, [sectionParam, isPublic]);

  return (
    <div className="min-h-svh bg-light mt-20">
      <ProfileHeader username={user.username} isPublic={isPublic}/>

      <div className="min-h-svh flex flex-col mt-4 lg:flex-row px-6 md:px-12 py-6 text-black font-lora">
        {/* side bar */}
        {!isPublic && <SideBar activeSection={activeSection}></SideBar>}

        {/* main content */}
        <div className="flex-1 ml-4">
          {isPublic ? (
              <FeedbackLayout userId={user._id} /> 
          ) : (
              sections[activeSection]
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;

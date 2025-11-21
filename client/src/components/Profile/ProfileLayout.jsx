import ProfileSection from "./ProfileSection.jsx";
import SideBar from "./SideBar.jsx";

const ProfileLayout = () => {
  return (
    <div className="">
      {/* side bar */}
      <SideBar></SideBar>

      {/* main content */}
      <div>
        <ProfileSection></ProfileSection>
      </div>
    </div>
  );
}

export default ProfileLayout;
import { useState } from "react";

const SideBar = ({activeSection, setActiveSection}) => {
  // menu sections
  const menu1 = [
    "Watch List",
    "Feedbacks",
    "Active Bids",
    "Auction Won",
  ];

  const menu2 = [
    "Account",
    "Payment",
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden w-full bg-white shadow-md p-4 mb-8 top-0 z-40">
        <div className="flex flex-wrap text-base font-medium items-center justify-center">
          {[...menu1, ...menu2].map(section => (
            <div
              key={section}
              onClick={() => setActiveSection(section)}
              className={`
                cursor-pointer px-2 py-1
                ${activeSection === section ? "border-b-2 border-primary font-semibold" : ""}
              `}
            >
              {section}
            </div>
          ))}
        </div>
      </div>

      {/* side bar */}
      <aside className="hidden lg:block w-28 lg:w-56 text-lg lg:text-xl">
        {/* profile */}
        <div className="mb-10">
          <h3 className="font-semibold text-gray-500 mb-3">Profile</h3>
          <ul className="space-y-2 ml-6">
            {menu1.map((section) => (
              <li key={section} onClick={() => setActiveSection(section)}
              className={`
                    cursor-pointer pl-2 py-1
                    ${activeSection === section ? "border-l-2 border-primary font-semibold" : "border-l-2 border-transparent"}
                    hover:border-accent transition-all
              `}>
                {section}
              </li>
            ))}
          </ul>
        </div>

        {/* setting */}
        <div>
          <h3 className="font-semibold text-gray-500 mb-3">Settings</h3>
          <ul className="space-y-2 ml-6">
            {menu2.map((section) => (
              <li key={section} onClick={() => setActiveSection(section)}
              className={`
                    cursor-pointer pl-2 py-1
                    ${activeSection === section ? "border-l-2 border-primary font-semibold" : "border-l-2 border-transparent"}
                    hover:border-accent transition-all
              `}>
                {section}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
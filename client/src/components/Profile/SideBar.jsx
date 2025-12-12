import { useNavigate } from "react-router-dom";

const SideBar = ({activeSection}) => {
  // navigate
  const navigate = useNavigate();
  
  // menu sections
  const menu1 = [
    { key: "watchlist", label: "Watch List" },
    { key: "feedbacks", label: "Feedbacks" },
    { key: "activebids", label: "Active Bids" },
    { key: "auctionwon", label: "Auction Won" },
  ];

  const menu2 = [
    { key: "account", label: "Account" },
    { key: "payment", label: "Payment" },
  ];

  // go to section by query 
  const goTo = (key) => navigate(`/profile?section=${key}`);

  return (
    <>
      {/* mobile top bar */}
      <div className="lg:hidden w-full bg-white shadow-md p-4 mb-8 top-0 z-40">
        <div className="flex flex-wrap text-base font-medium items-center justify-center">
          {[...menu1, ...menu2].map(item => (
            <div
              key={item.key}
              onClick={() => goTo(item.key)}
              className={`
                cursor-pointer px-2 py-1
                ${activeSection === item.key ? "border-b-2 border-primary font-semibold" : ""}
              `}
            >
              {item.label}
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
            {menu1.map((item) => (
              <li key={item.key} onClick={() => goTo(item.key)}
              className={`
                    cursor-pointer pl-2 py-1
                    ${activeSection === item.key ? "border-l-2 border-primary font-semibold" : "border-l-2 border-transparent"}
                    hover:border-accent transition-all
              `}>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* setting */}
        <div>
          <h3 className="font-semibold text-gray-500 mb-3">Settings</h3>
          <ul className="space-y-2 ml-6">
            {menu2.map((item) => (
              <li key={item.key} onClick={() => goTo(item.key)}
              className={`
                    cursor-pointer pl-2 py-1
                    ${activeSection === item.key ? "border-l-2 border-primary font-semibold" : "border-l-2 border-transparent"}
                    hover:border-accent transition-all
              `}>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
import { useState } from 'react'

const Sidebar = ({ category }) => {
    const [isOpen, setIsOpen] = useState(category.isOpen || false);
  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left text-gray-300 hover:text-white font-medium focus:outline-none"
      >
        <span>{category.name}</span>
        {/* {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />} */}
      </button>
      {isOpen && (
        <ul className="pl-4 mt-1 space-y-1">
          {category.subcategories.map((sub, index) => (
            <li key={index}>
              <a href="#" className="block py-1 text-sm text-gray-400 hover:text-yellow-500">
                {sub}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar
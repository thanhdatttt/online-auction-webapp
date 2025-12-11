import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router';

const Sidebar = ({ category }) => {
  const [isOpen, setIsOpen] = useState(category.isOpen || false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isActive = searchParams.get("categoryId") === category._id; // NOT BEING USED
  const hasChildren = category.children && category.children.length > 0;

  const handleClick = (e) => {
    e.stopPropagation();
    searchParams.set("categoryId", category._id);
    setSearchParams(searchParams);
  } 

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  }

  return (
    <div className="mb-2">
      <button
        onClick={handleClick}
        className="flex items-center justify-between w-full py-2 text-left text-2xl font-lato text-lighter hover:text-primary font-bold focus:outline-none"
      >
        <span>{category.name}</span>
        {hasChildren && (
          <Plus onClick={handleToggle} size={30} strokeWidth={4} />
        )}
      </button>
      
      {isOpen && hasChildren && (
        <div className="pl-4 mt-1 space-y-1">
          {category.children.map((sub, index) => (
            <Sidebar key={index} category={sub} />
            // <li key={index}>
            //   <button onClick={handleClick} className="block py-1 text-lg text-lighter font-bold hover:text-primary">
            //     {sub.name}
            //   </button>
            // </li>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar
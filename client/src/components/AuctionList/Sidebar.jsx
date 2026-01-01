import { Plus, Minus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Sidebar = ({ category, isOpen, onToggle, level = 0 }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isActive = searchParams.get("categoryId") === category._id;
  const hasChildren = category.children && category.children.length > 0;

  const handleSelect = (e) => {
    e.stopPropagation();
    // 1. Select the category
    const newParams = new URLSearchParams(searchParams);
    newParams.set("categoryId", category._id);
    newParams.set("page", "1"); // Reset to page 1 on category change
    setSearchParams(newParams);

    // 2. If it has children, also toggle it open/closed via parent
    if (hasChildren) {
      onToggle(category._id);
    }
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
    onToggle(category._id);
  };

  const textClass = isActive ? "text-orange-500" : "text-gray-300 hover:text-white";

  return (
    <div className="w-full select-none">
      <div 
        className={`flex items-center justify-between w-full py-2 cursor-pointer group transition-colors duration-200 ${textClass}`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={handleSelect}
      >
        <span className="font-lato font-bold text-lg tracking-wide">
          {category.name}
        </span>

        {hasChildren && (
          <button 
            onClick={handleIconClick}
            className="p-1 hover:bg-white/10 rounded-full transition"
          >
            {isOpen ? <Minus size={20} /> : <Plus size={20} />}
          </button>
        )}
      </div>

      {/* Recursive rendering */}
      {isOpen && hasChildren && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          {category.children.map((sub) => (
            <Sidebar 
                key={sub._id} 
                category={sub} 
                // Sub-items usually don't need the accordion logic (they can stay open), 
                // or you can pass recursive logic here if you want nested accordions.
                // For simple 2-level, we often just let sub-items show.
                isOpen={true} 
                onToggle={() => {}} 
                level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
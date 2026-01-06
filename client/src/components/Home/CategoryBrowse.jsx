import{ useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useCategoryStore } from '@/stores/useCategory.store';
import { Link } from 'react-router-dom'

const CategoryBrowse = () => {
  const categories = useCategoryStore((state) => state.categories);
  const { getCategories } = useCategoryStore();

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isSlider = categories.length > 5;

  useEffect(() => {
    getCategories();
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [categories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      const scrollTo =
        direction === 'left'
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
       <section className="bg-dark py-20 overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="h-px w-8 bg-amber-600/40"></span>
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-sm">
                Exquisite Selection
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-100 tracking-tight leading-[1.1]">
              Curated <span className="italic font-normal text-primary">Departments</span>
            </h2>
          </div>
          
          <div className="max-w-[280px]">
            <p className="text-slate-200 text-lg leading-relaxed md:text-right font-medium">
              Explore our masterfully categorized inventory of rare assets and luxury investments.
            </p>
          </div>
        </div>

        {/* Carousel Container with Side Buttons */}
        <div className="relative group/slider-container">
          
          {/* Navigation Buttons - Left */}
          {isSlider && (
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 transition-all duration-500 hidden md:block ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <button 
                onClick={() => scroll('left')}
                className="w-16 h-16 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 active:scale-95 group/btn"
              >
                <ChevronLeft size={24} strokeWidth={2} className="group-hover/btn:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Navigation Buttons - Right */}
          {isSlider && (
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 transition-all duration-500 hidden md:block ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <button 
                onClick={() => scroll('right')}
                className="w-16 h-16 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 active:scale-95 group/btn"
              >
                <ChevronRight size={24} strokeWidth={2} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* The Scrollable Viewport */}
          <div 
            ref={scrollRef}
            className={`
              flex space-x-8 overflow-x-auto pb-16 snap-x snap-mandatory scrollbar-hide no-scrollbar -mx-4 px-4
            `}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => (
              <Link to={`/auctions?categoryId=${category.id}`}>
              <div 
                key={index} 
                className="group relative min-w-[320px] md:min-w-[280px] aspect-10/14 overflow-hidden rounded-[2.5rem] cursor-pointer bg-slate-50 snap-start transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-2"
              >
                {/* Background Image */}
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1500 ease-out group-hover:scale-110"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-700" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-700" />
                
                {/* Card Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
                  <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <span className="text-primary text-sm font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      Discovery
                    </span>
                  </div>
                  
                  <h3 className="text-white text-5xl font-serif italic font-medium leading-tight tracking-tight mb-2">
                    {category.name}
                  </h3>
                  
                  <div className="h-10 relative overflow-hidden mt-2">
                    <div className="flex items-center space-x-3 text-white/50 group-hover:text-white transition-transforms duration-500 absolute inset-0 transform translate-y-full group-hover:translate-y-0 ease-out">
                      <span className="text-sm font-bold uppercase tracking-widest">Browse Gallery</span>
                      <ArrowUpRight size={14} className="text-amber-500" />
                    </div>
                  </div>
                </div>

                {/* Refined Glass Border */}
                <div className="absolute inset-0 border-10 border-transparent group-hover:border-white/5 transition-all duration-700 rounded-[2.5rem]" />
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryBrowse;
import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Search, Plus } from 'lucide-react';

export default function Table({ activeNav, currentPage, itemsPerPage, onTotalChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [categories, setCategories] = useState([]);

    // Sort states
    const [sortAlphabetical, setSortAlphabetical] = useState('asc');
    const [sortProducts, setSortProducts] = useState('desc');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('end-time');
    const [filterCategory, setFilterCategory] = useState('all');

    // Simulate fetching data
    const fetchData = async (page, limit, nav, filters = {}) => {
        setLoading(true);
        
        // Simulate API call with filters
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const offset = (page - 1) * limit;
        
        // Mock data based on active nav
        let mockTotal = 0;
        let mockData = [];
        
        if (nav === 'categories') {
        mockTotal = 87;
        mockData = Array(Math.min(limit, mockTotal - offset)).fill(null).map((_, i) => ({
            id: offset + i + 1,
            name: ['Arts', 'Electronics', 'Fashion', 'Collectibles'][i % 4],
            products: Math.floor(Math.random() * 50) + 10
        }));
        } else if (nav === 'products') {
        mockTotal = 156;
        mockData = Array(Math.min(limit, mockTotal - offset)).fill(null).map((_, i) => ({
            id: offset + i + 1,
            name: `Product ${offset + i + 1}`,
            status: ['live', 'scheduled', 'ended'][i % 3],
            currentBid: Math.floor(Math.random() * 1000) + 100,
            endTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            category: ['Arts', 'Electronics', 'Fashion'][i % 3]
        }));
        } else if (nav === 'users') {
        mockTotal = 243;
        mockData = Array(Math.min(limit, mockTotal - offset)).fill(null).map((_, i) => ({
            id: offset + i + 1,
            name: `User ${offset + i + 1}`,
            email: `user${offset + i + 1}@example.com`
        }));
        }
        
        setData(mockData);
        onTotalChange(mockTotal);
        setLoading(false);
    };

    useEffect(() => {
        if (activeNav === 'products') {
        // Mock fetch categories
        setCategories([
            { id: 1, name: 'Arts' },
            { id: 2, name: 'Electronics' },
            { id: 3, name: 'Fashion' },
            { id: 4, name: 'Collectibles' },
            { id: 5, name: 'Jewelry' }
        ]);
        }
    }, [activeNav]);

    useEffect(() => {
        const filters = {
        sortAlphabetical,
        sortProducts,
        filterStatus,
        sortBy,
        filterCategory
        };
        fetchData(currentPage, itemsPerPage, activeNav, filters);
    }, [currentPage, itemsPerPage, activeNav, sortAlphabetical, sortProducts, filterStatus, sortBy, filterCategory]);

    const getTitle = () => {
        const titles = {
        categories: 'Categories Management',
        products: 'Products Management',
        users: 'Users Management'
        };
        return titles[activeNav] || 'Management';
    };

    const getDescription = () => {
        const descriptions = {
        categories: 'Add, edit, and manage auction categories',
        products: 'View, and manage auction products',
        users: 'View, add, and manage users'
        };
        return descriptions[activeNav] || '';
    };

    return (
        <div className="flex-1 flex flex-col bg-light overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-decor">
            <div className="flex items-center justify-between mb-2">
            <div>
                <h2 className="text-3xl font-bold font-lato text-dark">{getTitle()}</h2>
                <p className="text-dark opacity-70 mt-1 font-lato">{getDescription()}</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-light rounded-lg font-medium hover:bg-orange-600 transition-colors">
                {activeNav === 'categories' || activeNav === "users" ? 
                    <img src="./dashboard/plus.svg" className="w-5 h-5" />
                : 
                    <img src="./dashboard/edit-white.svg" className="w-5 h-5" />    
                }
                {activeNav === 'categories' ? 'Add New Category' : activeNav === 'products' ? 'Edit Extension Time' : 'Add New User'}
            </button>
            </div>
        </div>

        {/* Search Bar and Filters */}
        <div className="px-8 py-4 space-y-3">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark opacity-60" size={20} />
                <input
                    type="text"
                    placeholder={`Search by ${activeNav === 'categories' ? 'category' : activeNav === 'products' ? 'product' : 'user'} name...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-decor border-0 rounded-lg text-dark placeholder-dark placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
            </div>

            {/* Sort/Filter Bars */}
            {activeNav === 'categories' && (
            <div className="flex gap-3">
                <select
                value={sortAlphabetical}
                onChange={(e) => setSortAlphabetical(e.target.value)}
                className="px-4 py-2.5 bg-decor border border-decor rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                <option value="asc">Alphabetical (A-Z)</option>
                <option value="desc">Alphabetical (Z-A)</option>
                </select>
                
                <select
                value={sortProducts}
                onChange={(e) => setSortProducts(e.target.value)}
                className="px-4 py-2.5 bg-decor border border-decor rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                <option value="desc">Products (High to Low)</option>
                <option value="asc">Products (Low to High)</option>
                </select>
            </div>
            )}

            {activeNav === 'products' && (
            <div className="flex gap-3">
                <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-decor border border-decor rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                <option value="all">All Status</option>
                <option value="live">Live</option>
                <option value="scheduled">Scheduled</option>
                <option value="ended">Ended</option>
                </select>
                
                <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-decor border border-decor rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                <option value="end-time">Sort by: End Time</option>
                <option value="alphabetical">Sort by: Alphabetical</option>
                <option value="current-bid">Sort by: Current Bid</option>
                </select>
                
                <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 bg-decor border border-decor rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                    {cat.name}
                    </option>
                ))}
                </select>
            </div>
            )}
        </div>

        {/* Table Container */}
        <div className="flex-1 px-8 pb-4 overflow-hidden flex flex-col">
            <div className="bg-light rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-decor border-b border-decor">
                {activeNav === 'categories' && (
                <>
                    <div className="col-span-5 text-sm font-regular font-lato text-dark opacity-60 uppercase tracking-wide flex items-center justify-center">
                        Category Name
                    </div>
                    <div className="col-span-3 text-sm font-regular font-lato text-dark opacity-60 uppercase tracking-wide flex items-center justify-center">
                        No. of Products
                    </div>
                </>
                )}
                {activeNav === 'products' && (
                <>
                    <div className="col-span-6 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Product Name
                    </div>
                    <div className="col-span-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Price
                    </div>
                </>
                )}
                {activeNav === 'users' && (
                <>
                    <div className="col-span-6 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    User Name
                    </div>
                    <div className="col-span-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Email
                    </div>
                </>
                )}
                <div className="col-span-3"></div>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Loading...</div>
                </div>
                ) : (
                data.map((item) => (
                    <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-amber-50 transition-colors"
                    >
                    {activeNav === 'categories' && (
                        <>
                        <div className="col-span-5 font-lato text-dark font-medium flex items-center justify-center">
                            {item.name}
                        </div>
                        <div className="col-span-3 font-lato text-dark font-medium flex items-center justify-center">
                            {item.products}
                        </div>
                        </>
                    )}
                    {activeNav === 'products' && (
                        <>
                        <div className="col-span-6 text-gray-800 font-medium">
                            {item.name}
                        </div>
                        <div className="col-span-3 text-gray-800">
                            ${item.price}
                        </div>
                        </>
                    )}
                    {activeNav === 'users' && (
                        <>
                        <div className="col-span-6 text-gray-800 font-medium">
                            {item.name}
                        </div>
                        <div className="col-span-3 text-gray-800">
                            {item.email}
                        </div>
                        </>
                    )}
                    <div className="col-span-3 flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-500 hover:text-primary cursor-pointer rounded transition-colors">
                        <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-primary cursor-pointer rounded transition-colors">
                        <Pencil size={18} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-secondary cursor-pointer rounded transition-colors">
                        <Trash2 size={18} />
                        </button>
                    </div>
                    </div>
                ))
                )}
            </div>
            </div>
        </div>
        </div>
    );
}
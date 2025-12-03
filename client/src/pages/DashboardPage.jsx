import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Search, Plus } from 'lucide-react'; 
import Sidebar from '../components/Dashboard/Sidebar';   
import Table from '../components/Dashboard/Table';


export default function DashboardPage() {
    const [categories] = useState(
        Array(9).fill({ name: 'Arts', products: 36 })
    );

    const [activeNav, setActiveNav] = useState('categories');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 9;

    const handleNavChange = (nav) => {
        setActiveNav(nav);
        setCurrentPage(1); // Reset to first page when changing nav
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleTotalChange = (total) => {
        setTotalItems(total);
    };

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            {/* Sidebar */}
            <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-light overflow-hidden">
                <Table activeNav={activeNav} currentPage={currentPage} itemsPerPage={itemsPerPage} onTotalChange={handleTotalChange} />

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
                    <button className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-lg font-medium">
                        1
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                        2
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                        3
                    </button>
                    <span className="px-2 text-gray-400">...</span>
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                        8
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                        9
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                        10
                    </button>
                </div>
            </div>
        </div>
    );
}
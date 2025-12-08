import { useState, useEffect } from 'react';
import Sidebar from '../components/Dashboard/Sidebar';   
import CategoriesTable from '../components/Dashboard/Table/CategoriesTable';
import ProductsTable from '../components/Dashboard/Table/ProductsTable';
import UsersManagement from '../components/Dashboard/Table/UserManagement';
import Pagination from '../components/Dashboard/Pagination';


export default function DashboardPage() {
    const [activeNav, setActiveNav] = useState(() => {
        return localStorage.getItem('activeNav') || 'categories';
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        localStorage.setItem('activeNav', activeNav);
    }, [activeNav]);

    const handleNavChange = (nav) => {
        setActiveNav(nav);
        setCurrentPage(1); // Reset to first page when changing nav
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleTotalChange = (total) => {
        setTotalPages(total);
    };


    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            {/* Sidebar */}
            <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-light overflow-hidden">
                {activeNav === 'categories' && (
                    <CategoriesTable 
                        currentPage={currentPage} 
                        itemsPerPage={itemsPerPage} 
                        onTotalChange={handleTotalChange} 
                    />
                    )}
                    {activeNav === 'products' && (
                    <ProductsTable 
                        currentPage={currentPage} 
                        itemsPerPage={itemsPerPage} 
                        onTotalChange={handleTotalChange} 
                    />
                    )}
                    {activeNav === 'users' && (
                    <UsersManagement 
                        currentPage={currentPage} 
                        itemsPerPage={itemsPerPage} 
                        onTotalChange={handleTotalChange} 
                    />
                )}


                {/* Pagination */}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
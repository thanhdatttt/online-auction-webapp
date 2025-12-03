import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Search, Plus } from 'lucide-react';    


export default function DashboardPage() {
    const [categories] = useState(
        Array(9).fill({ name: 'Arts', products: 36 })
    );
    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-white p-6 flex flex-col">
                <h1 className="text-4xl font-serif italic mb-12">Auctiz</h1>
                
                <nav className="flex-1 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-orange-100 text-orange-600 rounded-lg font-medium">
                    <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-4 h-3 border-2 border-current rounded-sm"></div>
                    </div>
                    Categories
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                    <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-current rounded-full relative">
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full"></div>
                    </div>
                    </div>
                    Products
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                    <div className="w-5 h-5 flex items-center justify-center">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <circle cx="7" cy="6" r="3" />
                        <circle cx="13" cy="6" r="3" />
                        <path d="M4 14c0-2 1.5-3 3-3s3 1 3 3v2H4v-2z" />
                        <path d="M10 14c0-2 1.5-3 3-3s3 1 3 3v2h-6v-2z" />
                    </svg>
                    </div>
                    Users
                </button>
                </nav>
                
                <button className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-current rounded relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-0.5 bg-current"></div>
                    </div>
                    </div>
                </div>
                Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-amber-50 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-amber-100">
                <div className="flex items-center justify-between mb-2">
                    <div>
                    <h2 className="text-3xl font-bold text-gray-900">Categories Management</h2>
                    <p className="text-gray-600 mt-1">Add, edit, and manage auction categories</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                    <Plus size={20} />
                    Add New Category
                    </button>
                </div>
                </div>

                {/* Search Bar */}
                <div className="px-8 py-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                    type="text"
                    placeholder="Search by category name..."
                    className="w-full pl-12 pr-4 py-3 bg-amber-100 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                </div>

                {/* Table Container - Fixed Height */}
                <div className="flex-1 px-8 pb-4 overflow-hidden flex flex-col">
                <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-amber-100 border-b border-amber-200">
                    <div className="col-span-6 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Category Name
                    </div>
                    <div className="col-span-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        No. of Products
                    </div>
                    <div className="col-span-3"></div>
                    </div>

                    {/* Table Body - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                    {categories.map((category, idx) => (
                        <div
                        key={idx}
                        className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-amber-50 transition-colors"
                        >
                        <div className="col-span-6 text-gray-800 font-medium">
                            {category.name}
                        </div>
                        <div className="col-span-3 text-gray-800">
                            {category.products}
                        </div>
                        <div className="col-span-3 flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                            <Eye size={18} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                            <Pencil size={18} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 size={18} />
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>

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
            </div>
        </div>
    );
}
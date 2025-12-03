import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, Search, Plus } from 'lucide-react';

export default function Sidebar({activeNav, onNavChange}) {
    const navItems = [
        { id: 'categories', label: 'Categories', icon: 'cate' },
        { id: 'products', label: 'Products', icon: 'prod' },
        { id: 'users', label: 'Users', icon: 'users' }
    ];

    return (
        <div className="w-64 bg-light p-6 flex flex-col">
            <h1 className="text-4xl font-lora font-semibold italic mb-12 text-dark text-center">Auctiz</h1>
            
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onNavChange(item.id)}
                    className={`group w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeNav === item.id
                        ? 'bg-decor text-primary'
                        : 'text-dark hover:text-primary hover:bg-decor cursor-pointer'
                    }`}
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                    {item.icon === 'cate' && (
                        <>
                            <img src='./dashboard/cate-unselect.svg' className={`w-5 h-5 ${activeNav === item.id ? "hidden" : "block group-hover:hidden"}`} />
                            <img src='./dashboard/cate-select.svg' className={`w-5 h-5 ${activeNav === item.id ? "block" : "hidden group-hover:block"}`} />
                        </>
                    )}
                    {item.icon === 'prod' && (
                        <>
                            <img src='./dashboard/prod-unselect.svg' className={`w-5 h-5 ${activeNav === item.id ? "hidden" : "block group-hover:hidden"}`} />
                            <img src='./dashboard/prod-select.svg' className={`w-5 h-5 ${activeNav === item.id ? "block" : "hidden group-hover:block"}`} />
                        </>
                    )}
                    {item.icon === 'users' && (
                        <>
                            <img src='./dashboard/user-unselect.svg' className={`w-5 h-5 ${activeNav === item.id ? "hidden" : "block group-hover:hidden"}`} />
                            <img src='./dashboard/user-select.svg' className={`w-5 h-5 ${activeNav === item.id ? "block" : "hidden group-hover:block"}`} />
                        </>
                    )}
                    </div>
                    {item.label}
                </button>
                ))}
            </nav>
            
            <button className="group flex items-center gap-3 px-4 py-3 text-dark hover:cursor-pointer hover:bg-decor hover:text-primary rounded-lg font-medium">
                <>
                    <img src='./dashboard/logout-unselect.svg' className="w-5 h-5 block group-hover:hidden" />
                    <img src='./dashboard/logout-select.svg' className="w-5 h-5 hidden group-hover:block" />
                </>
                Logout
            </button>
        </div>
    );
}
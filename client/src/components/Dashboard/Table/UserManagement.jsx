import { useState } from "react";
import AllUsersTable from "./AllUsersTable";
import UpgradeRequestsTable from "./UpgradeRequestsTable";

export default function UsersManagement({ currentPage, itemsPerPage, onTotalChange }) {
    const [activeTab, setActiveTab] = useState('all-users');

    return (
        <div className="flex-1 flex flex-col bg-light overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-decor">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h2 className="text-3xl font-bold font-lato text-dark">Users Management</h2>
                        <p className="font-lato text-dark/70 mt-1">View, add, and manage users</p>
                    </div>
                    <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                        <img src="./dashboard/plus.svg" className="w-5 h-5" />
                        Add New User
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mt-4">
                    <button
                        onClick={() => setActiveTab('all-users')}
                        className={`pb-2 border-b-[2.5px] font-semibold font-lato transition-colors ${
                        activeTab === 'all-users'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-dark/60 hover:text-gray-700'
                        }`}
                    >
                        All Users
                    </button>
                    <button
                        onClick={() => setActiveTab('upgrade-requests')}
                        className={`pb-2 border-b-[2.5px] font-semibold font-lato transition-colors flex items-center gap-2 ${
                        activeTab === 'upgrade-requests'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-dark/60 hover:text-gray-700'
                        }`}
                    >
                        Upgrade Requests
                        <span className="px-1.5 py-1 bg-primary text-light text-[10px] rounded-full">9+</span>
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'all-users' ? (
                <div className="flex-1 overflow-hidden">
                    <AllUsersTable currentPage={currentPage} itemsPerPage={itemsPerPage} onTotalChange={onTotalChange} />
                </div>
            ) : (
                <div className="flex-1 overflow-hidden">
                    <UpgradeRequestsTable currentPage={currentPage} itemsPerPage={itemsPerPage} onTotalChange={onTotalChange} />
                </div>
            )}
        </div>
    );
}
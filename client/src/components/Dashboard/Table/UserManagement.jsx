import { useState, useEffect, useRef } from "react";
import AllUsersTable from "./AllUsersTable";
import UpgradeRequestsTable from "./UpgradeRequestsTable";
import api from "../../../utils/axios";

export default function UsersManagement({ currentPage, itemsPerPage, onTotalChange }) {
    const [activeTab, setActiveTab] = useState('all-users');
    const [unreadRequestCount, setUnreadRequestCount] = useState(
        Number(localStorage.getItem("unreadRequests")) || 0
    );

    const lastTotalRef = useRef(
        Number(localStorage.getItem("lastRequestTotal")) || 0
    );

    const fetchUpgradeRequestCount = async () => {
        try {
            const res = await api.get("/admin/requestRole/count");
            const total = res.data.count;

            if (activeTab === 'upgrade-requests') {
                // mark all as read
                lastTotalRef.current = total;
                localStorage.setItem("lastRequestTotal", total);
                setUnreadRequestCount(0);
                if (unreadRequestCount !== 0) setUnreadRequestCount(0);
                return;
            } 

            const diff = total - lastTotalRef.current;

            if (diff > 0) {
                setUnreadRequestCount(diff);
            }

            // always store total
            lastTotalRef.current = total;
            localStorage.setItem("lastRequestTotal", total);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        localStorage.setItem("unreadRequests", unreadRequestCount);
    }, [unreadRequestCount]);

    useEffect(() => {
        fetchUpgradeRequestCount(); // initial fetch
        const interval = setInterval(fetchUpgradeRequestCount, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        if (tab === "upgrade-requests") {
            setUnreadRequestCount(0);                        // clear badge immediately
            localStorage.setItem("unreadRequests", 0);
        }
    };

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
                        onClick={() => handleTabSwitch('all-users')}
                        className={`pb-2 border-b-[2.5px] font-semibold font-lato transition-colors ${
                        activeTab === 'all-users'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-dark/60 hover:text-gray-700'
                        }`}
                    >
                        All Users
                    </button>
                    <button
                        onClick={() => handleTabSwitch('upgrade-requests')}
                        className={`pb-2 border-b-[2.5px] font-semibold font-lato transition-colors flex items-center gap-2 ${
                        activeTab === 'upgrade-requests'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-dark/60 hover:text-gray-700'
                        }`}
                    >
                        Upgrade Requests
                        {unreadRequestCount > 0 && (
                            <span className="px-2 py-1 bg-primary text-light text-[10px] rounded-full">
                                {unreadRequestCount > 9 ? "9+" : unreadRequestCount}
                            </span>
                        )}
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
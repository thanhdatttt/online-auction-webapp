import { useState, useEffect } from "react";
import api from "../../utils/axios";

export default function ViewUserModal({ open, onClose, miniuser }) {
    const [user, setUser] = useState(null);

    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'seller':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'bidder':
                return 'bg-green-100 text-[#34A853] border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusBadgeColor = (status) => {
        return status?.toLowerCase() === 'active'
            ? 'bg-green-100 text-[#34A853] border-green-200'
            : 'bg-red-100 text-secondary border-red-200';
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        if (!open || !miniuser._id) return;
        const loadData = async () => {
            try {
                const res = await api.get(`/admin/users/${miniuser._id}`);

                console.log(res.data.user);
                setUser(res.data.user);
            } catch (error) {
                console.error(error);
            }
            // finally {
            //     setLoading(false);
            // }

        };

        loadData();
    }, [open, miniuser]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
            <div className="bg-light rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold font-lato text-dark">User Information</h3>
                        <button 
                            onClick={onClose}
                            className="text-dark/60 cursor-pointer hover:text-dark transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Avatar and Basic Info */}
                    <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shrink-0 overflow-hidden">
                            <img src={user?.avatar_url ? user?.avatar_url : "./default_person.webp"} alt={user?.username} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xl font-bold text-dark mb-2">@{user?.username}</h4>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user?.role)}`}>
                                    {user?.role?.toUpperCase()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(user?.status)}`}>
                                    {user?.status?.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Details Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-dark/60 mb-2">First Name</label>
                            <p className="text-base text-dark font-medium">{user?.firstName || 'N/A'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark/60 mb-2">Last Name</label>
                            <p className="text-base text-dark font-medium">{user?.lastName || 'N/A'}</p>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-dark/60 mb-2">Email Address</label>
                            <p className="text-base text-dark font-medium">{user?.email || 'N/A'}</p>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-dark/60 mb-2">Address</label>
                            <p className="text-base text-dark font-medium">{user?.address || 'N/A'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark/60 mb-2">Birthday</label>
                            <p className="text-base text-dark font-medium">{formatDate(user?.birthday)}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark/60 mb-2">Account Created</label>
                            <p className="text-base text-dark font-medium">{formatDate(user?.createdAt)}</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end mt-6 pt-6 border-t border-decor">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 cursor-pointer bg-light text-dark rounded-lg font-medium hover:bg-decor transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
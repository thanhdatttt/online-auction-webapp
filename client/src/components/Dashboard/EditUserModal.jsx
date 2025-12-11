import { useState, useEffect, useRef } from "react";
import api from "../../utils/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const UserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.email("Invalid email"),
  address: z.string().optional(),
  birthday: z.string().optional(),
  role: z.enum(["bidder", "seller", "admin"]),
  status: z.enum(["active", "banned"]),
  avatar: z.string().optional(),
});

export default function EditUserModal({ open, onClose, miniuser, onUserUpdated }) {
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [providers, setProviders] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            birthday: "",
            role: "bidder",
            status: "active",
            avatar: "",
        },
    });

    const watchedStatus = watch("status");
    const avatar = watch("avatar");

    useEffect(() => {
        if (!open || !miniuser._id) return;
        const loadData = async () => {
            try {
                const res = await api.get(`/admin/users/${miniuser._id}`);

                const u = res.data.user;

                reset({
                    username: u.username || "",
                    firstName: u.firstName || "",
                    lastName: u.lastName || "",
                    email: u.email || "",
                    address: u.address || "",
                    birthday: u.birthday
                        ? new Date(u.birthday).toISOString().split("T")[0]
                        : "",
                    role: u.role || "bidder",
                    status: u.status || "active",
                    avatar: u.avatar_url || "",
                });

                setProviders((u.providers?.google?.id ?? null) !== null || (u.providers?.facebook?.id ?? null) !== null);
            } catch (error) {
                console.error(error);
                setServerError("Failed to load user");
            }
        };

        loadData();
    }, [open, miniuser, reset]);

    const onSubmit = async (data) => {
        setServerError("");
        setSuccessMessage("");

        try {
            await api.put(`/admin/users/${miniuser._id}`, data);
            setSuccessMessage("User updated successfully!");

            setTimeout(() => {
                onClose();
                onUserUpdated?.();
            }, 1200);
        } catch (err) {
            setServerError(err.response?.data?.message || "Failed to update user");
        }
    };

    const handleResetPassword = async () => {
        setServerError("");
        setSuccessMessage("");
        setIsResettingPassword(true);

        try {
            await api.post(`/admin/users/${miniuser._id}/reset-password`);
            setSuccessMessage('Password reset email sent successfully!');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsResettingPassword(false);
        }
    };

    const handleToggleStatus = async () => {
        setServerError("");
        setSuccessMessage("");
        setIsTogglingStatus(true);
        const newStatus = watchedStatus === "active" ? "banned" : "active";

        try {
            await api.put(`/admin/users/${miniuser._id}/status`, { status: newStatus });
            setValue("status", newStatus);

            setSuccessMessage(`User ${newStatus === 'banned' ? 'banned' : 'reactivated'} successfully!`);
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (err) {
            setServerError(err.response?.data?.message || 'Failed to update user status');
        } finally {
            setIsTogglingStatus(false);
        }
    };

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

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
            <div className="bg-light rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold font-lato text-dark">Edit User</h3>
                        <button 
                            onClick={() => {
                                setServerError("");
                                setSuccessMessage("");
                                onClose();
                            }}
                            className="text-dark/60 cursor-pointer hover:text-dark transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {serverError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-secondary text-sm">
                            {serverError}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-[#34A853] text-sm">
                            {successMessage}
                        </div>
                    )}

                    {/* Avatar and Basic Info */}
                    <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shrink-0 overflow-hidden">
                            <img src={avatar ? avatar : "./default_person.webp"} alt={watch("username")} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xl font-bold text-dark mb-2">@{watch("username")}</h4>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(watch("role"))}`}>
                                    {watch("role").toUpperCase()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(watch("status"))}`}>
                                    {watch("status").toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form - Two Column Layout */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Left Column - Main Information */}
                        <div className="col-span-2 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark mb-1">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("username")}
                                        className="w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        className="w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="user@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark mb-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("firstName")}
                                        className="w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="John"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark mb-1">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("lastName")}
                                        className="w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Role & Birthday */}
                        <div className="col-span-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark mb-1">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register("role")}
                                    disabled={watch("role") === "admin"}
                                    className="w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="bidder">Bidder</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark mb-1">Birthday</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left h-10 px-3 py-2 border cursor-pointer border-decor rounded-lg bg-light text-dark hover:bg-light"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {watch("birthday")
                                                ? format(new Date(watch("birthday")), "MMM dd, yyyy")
                                                : "Select date"}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="bg-light text-dark border border-decor rounded-md shadow-lg p-0 w-auto">
                                        <Calendar
                                            mode="single"
                                            selected={watch("birthday") ? new Date(watch("birthday")) : undefined}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                if (!date) return;
                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const day = String(date.getDate()).padStart(2, '0');

                                                setValue("birthday", `${year}-${month}-${day}`);
                                            }}
                                            fromYear={1900}
                                            toYear={new Date().getFullYear()}
                                            autoFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Full Width Address Field */}
                        <div className="col-span-3">
                            <label className="block text-sm font-medium text-dark mb-1">Address</label>
                            <input
                                type="text"
                                {...register("address")}
                                className="w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="123 Main St, City, Country"
                            />
                        </div>

                        {/* Password Reset Section */}
                        <div className="col-span-3 grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">Password</label>
                                <input
                                    type="password"
                                    disabled={providers}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2 border border-decor rounded-lg text-gray-500 bg-gray-50 mb-3"
                                />
                                <button
                                    type="button"
                                    onClick={handleResetPassword}
                                    disabled={isResettingPassword || providers}
                                    className="w-full px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isResettingPassword ? 'Resetting...' : 'Reset Password'}
                                </button>
                                <p className="text-xs text-dark/60 mt-2">Send a password reset email to the user</p>
                            </div>

                            {/* Ban/Reactivate Section */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">Account Actions</label>
                                <div className="h-10 mb-3"></div>
                                <button
                                    type="button"
                                    onClick={handleToggleStatus}
                                    disabled={isTogglingStatus || watch("role") === "admin"}
                                    className={`w-full px-4 cursor-pointer py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                        watch("status") === 'active'
                                            ? 'bg-secondary text-light hover:bg-red-600'
                                            : 'bg-[#34A853] text-light hover:bg-green-600'
                                    }`}
                                >
                                    {isTogglingStatus 
                                        ? 'Processing...' 
                                        : watch("status") === 'active' 
                                            ? 'Ban User' 
                                            : 'Reactivate User'
                                    }
                                </button>
                                <p className="text-xs text-dark/60 mt-2">
                                    {watch("status") === 'active' 
                                        ? 'Prevent this user from accessing the platform'
                                        : 'Allow this user to access the platform again'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => {
                                setServerError("");
                                setSuccessMessage("");
                                onClose();
                            }}
                            className="flex-1 px-4 py-2.5 border cursor-pointer border-decor text-dark rounded-lg font-medium bg-light hover:bg-decor transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-orange-500 cursor-pointer text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
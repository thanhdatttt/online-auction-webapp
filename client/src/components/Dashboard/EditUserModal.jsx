import { useState, useEffect, useRef } from "react";
import api from "../../utils/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

const UserSchema = z.object({
  username: z.string().transform(v => v === "" ? undefined : v).optional(),
  firstName: z.string().transform(v => v === "" ? undefined : v).optional(),
  lastName: z.string().transform(v => v === "" ? undefined : v).optional(),
  email: z.email("Invalid email").optional(),
  address: z.string().optional(),
  birthday: z.string().optional(),
  role: z.enum(["bidder", "seller", "admin"]).optional(),
  status: z.enum(["active", "banned"]).optional(),
  avatar: z.string().optional(),
});

export default function EditUserModal({ open, onClose, miniuser, onUserUpdated }) {
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
                birthday: u.birth
                    ? new Date(u.birth).toISOString().split("T")[0]
                    : "",
                role: u.role || "bidder",
                status: u.status || "active",
                avatar: u.avatar_url || "",
            });

            setProviders((u.providers?.google?.id ?? null) !== null || (u.providers?.facebook?.id ?? null) !== null);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (!open || !miniuser._id) return;

        loadData();
    }, [open, miniuser, reset]);

    const onSubmit = async (data) => {
        try {
            const res = await api.patch(`/admin/users/${miniuser._id}`, data);
            
            if (res.status === 200) {
                toast.success("Update User Information Successfully!")
    
                setTimeout(() => {
                    onClose();
                    onUserUpdated?.();
                }, 1200);
            }
        } catch (err) {
            toast.error("Update User Information Unsuccessfully!")
        }
    };

    const handleResetPassword = async () => {
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
        setIsTogglingStatus(true);
        const newStatus = watchedStatus === "active" ? "banned" : "active";

        try {
            const res = await api.patch(`/admin/users/${miniuser._id}/status`, { status: newStatus });

            if (res.status === 200) {
                toast.success(`${watchedStatus === "active" ? "Ban" : "Reactivate"} User Successfully!`)
                await loadData();

                setValue("status", newStatus);
    
                if (onUserUpdated) {
                    onUserUpdated();
                }
            }
        } catch (err) {
            console.log(err)
            toast.error(`${watchedStatus === "active" ? "Ban" : "Reactivate"} User Unsuccessfully!`)
        } finally {
            setIsTogglingStatus(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
            <div className="bg-light rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-8 py-6 border-b border-decor">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-dark">
                                Edit User: {watch("username")}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Update user profile, role, and security settings.
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>


                <div className="p-8">
                    {/* Edit Form - Two Column Layout */}
                    <div className="grid grid-cols-3 gap-8">
                        {/* Left Column - Main Information */}
                        <div className="col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-dark mb-1">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                {...register("username")}
                                                disabled
                                                className="cursor-not-allowed w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="username"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-dark mb-1">Birthday</label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start text-left h-10 px-3 py-2 border cursor-pointer border-decor rounded-lg bg-light text-dark hover:bg-primary"
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
                                                            console.log(date);
                                                            const year = date.getFullYear();
                                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                                            const day = String(date.getDate()).padStart(2, '0');

                                                            setValue("birthday", `${year}-${month}-${day}`);
                                                        }}
                                                        startMonth={new Date(1900, 0)}
                                                        disabled={(date) => date > new Date()}
                                                        autoFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-dark mb-1">
                                                First Name
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
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                {...register("lastName")}
                                                className="w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-dark mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            {...register("email")}
                                            className="w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="user@example.com"
                                        />
                                    </div>

                                    <div>
                                        <div>
                                            <label className="block text-sm font-medium text-dark mb-1">
                                                Role
                                            </label>
                                            <select
                                                {...register("role")}
                                                disabled={watch("role") === "admin"}
                                                className={`w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${watch("role") === "admin" ? "cursor-not-allowed" : "cursor-pointer"}`}
                                            >
                                                <option value="bidder">Bidder</option>
                                                <option value="seller">Seller</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>

                                        
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-dark mb-1">Address</label>
                                        <input
                                            type="text"
                                            {...register("address")}
                                            className="w-full px-3 py-2 border border-decor text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="123 Main St, City, Country"
                                        />
                                    </div>

                                    
                                </div>
                            </div>

                        </div>

                        <div className="col-span-1 space-y-6">
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <h3 className="text-base font-semibold text-gray-900 mb-2">Account Security</h3>
                                <div>
                                    <label className="block text-sm font-medium text-dark mb-2">Password</label>
                                    <input
                                        type="password"
                                        disabled={providers}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2 border border-decor rounded-lg text-gray-500 bg-gray-50 mb-1.5"
                                    />
                                    <p className="text-xs text-dark/60 mt-0">Set a new password for the user</p>
                                    <button
                                        type="button"
                                        onClick={handleResetPassword}
                                        disabled={isResettingPassword || providers}
                                        className="w-full px-4 py-2 mt-2 cursor-pointer bg-dark/90 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isResettingPassword ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </div>

                                

                            </div>

                            <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Account Status</h3>
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <div className={`w-3 h-3 rounded-full ${watch("status") === 'active' ? 'bg-[#34A853]' : 'bg-secondary'}`}></div>
                                    <span className="text-lg font-medium text-gray-900">
                                        {watch("status") === 'active' ? 'Active' : 'Banned'}
                                    </span>
                                    
                                </div>
                                <button
                                    type="button"
                                    onClick={handleToggleStatus}
                                    disabled={isTogglingStatus || watch("role") === "admin"}
                                    className={`px-3 cursor-pointer w-full py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border cursor-pointer border-decor text-dark rounded-lg font-medium bg-light hover:bg-decor transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-primary cursor-pointer text-light rounded-lg font-medium hover:bg-orange-600 transition-colors"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
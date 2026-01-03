import { useState } from "react";
import api from "../../utils/axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const addUserSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["bidder", "seller", "admin"])
});

export default function AddUserModal({ isOpen, onClose, onUserCreated }) {
     const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            role: "bidder"
        }
    });

    const onSubmit = async (data) => {
        try {
            const res = await api.post("/admin/users", data);
            if (res.status === 201) {
                reset();  // Clear form
                onClose();
            }
            if (onUserCreated) onUserCreated();
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
            <div className="bg-light rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold font-lato text-dark">Add New User</h3>
                        <button 
                            onClick={handleClose}
                            className="text-dark/60 cursor-pointer hover:text-dark transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {(errors.username || errors.email || errors.password || errors.role) && (
                        <div className="mb-4 p-3 font-lato font-semibold bg-red-200 border border-red-200 rounded-lg text-secondary text-sm">
                            {errors.username?.message ||
                            errors.email?.message ||
                            errors.password?.message ||
                            errors.role?.message}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">
                                Username <span className="text-secondary">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("username")}
                                className="w-full px-3 py-2 border text-dark border-decor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">
                                Email <span className="text-secondary">*</span>
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full px-3 py-2 border text-dark border-decor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="user@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">
                                Password <span className="text-secondary">*</span>
                            </label>
                            <input
                                type="password"
                                {...register("password")}
                                className="w-full px-3 py-2 border text-dark border-decor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">
                                Role <span className="text-secondary">*</span>
                            </label>
                            <select
                                {...register("role")}
                                className="w-full px-3 py-2 border cursor-pointer text-dark border-decor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="bidder">Bidder</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4 mt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-2 border border-decor text-dark rounded-lg font-medium bg-light hover:bg-decor cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 cursor-pointer bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
import { useState } from "react";
import api from "../../utils/axios";
import { toast } from "sonner";

export default function DeleteAuctionModal({ open, onClose, item, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    console.log(item);
    
    const confirmDelete = async () => {
        if (!item) return;

        setDeleting(true);
        try {
            const res = await api.post(`/admin/auction/${item._id}/delete`);
            if (res.status === 200){
                toast.success("Delete Auction successfully!");
                onDeleted();
            }
        } catch (err) {
            console.error(err);
            toast.error("Delete Auction unsuccessfully!");
        } finally {
            setDeleting(false);
        }
    };
    
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
            <div className="bg-light rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-dark font-lato">
                                Delete Auction
                            </h2>
                        </div>
                        
                        <button 
                            onClick={onClose}
                            className="text-dark/60 cursor-pointer hover:text-dark transition-colors -mt-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="text-dark font-lato leading-relaxed">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-dark">{item?.product.name.length > 50 ? item?.product.name.slice(0,50) + "..." : item?.product.name}</span>?
                        </p>
                        <p className="text-dark/70 font-lato mt-2 text-sm">
                            This action cannot be undone. All user data will be permanently removed.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={deleting}
                            className="flex-1 cursor-pointer px-4 py-2.5 border border-gray-300 bg-light text-dark rounded-lg font-medium hover:bg-decor transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={confirmDelete}
                            disabled={deleting}
                            className="flex-1 cursor-pointer px-4 py-2.5 bg-secondary text-light rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {deleting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </span>
                            ) : (
                                'Delete Auction'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
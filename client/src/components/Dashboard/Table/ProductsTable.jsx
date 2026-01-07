import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import BaseTable from "./BaseTable";
import EditExtensionPopup from "../EditExtensionModal";
import { useAuctionStore } from "@/stores/useAuction.store";
import DeleteAuctionModal from "../DeleteAuctionModal";
import api from "@/utils/axios";
import { useCategoryStore } from "@/stores/useCategory.store";

export default function ProductsTable({ currentPage, itemsPerPage, onTotalChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState(null);

    const {formatPrice, formatTime} = useAuctionStore();

    const [sortState, setSortState] = useState({
        product: "none",
        bid: "none",
        endTime: "none"
    });

    const { categories, getCategories } = useCategoryStore();

    useEffect(() => {
        // Only fetch if we don't have them yet (optional optimization)
        if (categories.length === 0) {
            getCategories();
        }
    }, [getCategories, categories.length]);

    const toggleSort = (field) => {
        setSortState((prev) => {
            const order = prev[field] === "asc" ? "desc" : prev[field] === "desc" ? "none" : "asc";

            return { product: "none", bid: "none", endTime: "none", [field]: order };
        });
    };

    const buildQueryString = () => {
        const params = new URLSearchParams();

        params.append("page", currentPage);

        // search
        if (searchQuery.trim() !== "") {
            params.append("search", searchQuery.trim());
        }

        // filters
        if (filterCategory !== "all") params.append("categoryId", filterCategory);
        if (filterStatus !== "all") params.append("status", filterStatus);

        // sorting
        const sortParts = [];
        Object.keys(sortState).forEach((key) => {
            if (sortState[key] !== "none") sortParts.push(`${key}:${sortState[key]}`);
        });
        if (sortParts.length > 0) params.append("sort", sortParts.join(","));

        return params.toString();
    };

    const loadData = async () => {
        try {
            setLoading(true);

            const query = buildQueryString();

            const res = await api.get(`/admin/auctions?${query}`);

            console.log(res);
            const data = res.data;
            onTotalChange(data.totalPages);
            setData(data.auctions);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }

    };

    const handleSaveConfig = (config) => {
        console.log('Configuration saved:', config);
        // You can add a success notification here
    };

    // Simulate data fetch
    useEffect(() => {
        loadData();
    }, [currentPage, searchQuery, filterStatus, filterCategory, sortState]);

    const filters = (
        <div className="flex gap-3">
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-decor border-0 rounded-lg text-dark/80 font-lato font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                <option value="all">All Status</option>
                <option value="ongoing">Live</option>
                <option value="ended">Ended</option>
            </select>
            
            <select
                value={filterCategory}
                onClick={() => getCategories()}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 bg-decor border-0 rounded-lg text-dark/80 font-lato font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>
        </div>
    );

    const columns = [
        { header: 'Product Name', width: '4fr', sortField: "product"},
        { header: 'Current Bid', width: '2fr', sortField: "bid" },
        { header: 'End Time', width: '2fr', sortField: "endTime" },
        { header: 'Status', width: '2fr' },
        { header: '', width: '2fr' }
    ];

    const renderRow = (item) => (
        <div
        key={item._id}
        className="grid gap-4 px-6 py-[0.565rem] border-2 border-b border-decor hover:bg-amber-50 transition-colors"
        style={{ gridTemplateColumns: columns.map(c => c.width).join(' ') }}
        >
            <div className="font-semibold text-dark font-lato flex gap-2 items-center ml-16">
                <img src={item.product.images[0].url} className="w-8 h-8 rounded-sm" />
                {item.product.name.length > 30 ? item.product.name.slice(0,30) + "..." : item.product.name}
            </div>
            <div className="font-medium text-dark/80 font-lato flex items-center justify-center">{formatPrice(item.currentPrice)} VNĐ</div>
            <div className="font-medium text-dark/80 font-lato flex items-center justify-center">{formatTime(item.endTime)}</div>
            <div className="flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'ongoing' ? 'bg-green-200 text-[#34A853]' :
                'bg-red-200 text-secondary'
                }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
            </div>
            <div className="flex items-center justify-end gap-2 mr-8">
                <button onClick={() => {
                    setShowDeleteModal(true);
                    setSelectedAuction(item);
                }} className="cursor-pointer px-2 py-1 text-dark/80 hover:text-secondary rounded transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <>
            <BaseTable
            title="Products Management"
            description="View and manage auction products"
            buttonText="Edit Extension Time"
            buttonIcon="./dashboard/edit-white.svg"
            searchPlaceholder="Search by product name..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortState={sortState}
            onSortChange={toggleSort}
            filters={filters}
            columns={columns}
            data={data}
            loading={loading}
            onAdd={() => setIsPopupOpen(true)}
            renderRow={renderRow}
            />

            <DeleteAuctionModal
                open={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                }}
                onDeleted={() => {
                    setShowDeleteModal(false);
                    setSelectedAuction(null);
                    loadData();
                }}
                item={selectedAuction}
            />

            <EditExtensionPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSave={handleSaveConfig}
            />
        </>
    );
}
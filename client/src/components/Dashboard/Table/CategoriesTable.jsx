import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import BaseTable from "./BaseTable";

export default function CategoriesTable({ currentPage, itemsPerPage, onTotalChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [sortState, setSortState] = useState({
        category: "none",
        product: "none"
    });

    const toggleSort = (field) => {
        setSortState((prev) => {
            const order = prev[field] === "asc" ? "desc" : prev[field] === "desc" ? "none" : "asc";

            return { category: "none", product: "none", [field]: order };
        });
    };

    // Simulate data fetch
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
        const mockData = Array(9).fill(null).map((_, i) => ({
            id: i + 1,
            name: ['Arts', 'Electronics', 'Fashion', 'Collectibles', 'Jewelry', 'Antiques', 'Books', 'Sports', 'Music'][i],
            products: Math.floor(Math.random() * 50) + 10
        }));
        setData(mockData);
        onTotalChange(87);
        setLoading(false);
        }, 500);
    }, []);

    const columns = [
        { header: 'Category Name', width: '5fr', sortField: "category" },
        { header: 'No. of Products', width: '3fr', sortField: "product" },
        { header: '', width: '4fr' }
    ];

    const renderRow = (item) => (
        <div
        key={item.id}
        className="grid gap-4 px-6 py-3 border-b border-2 border-decor hover:bg-amber-50 transition-colors"
        style={{ gridTemplateColumns: columns.map(c => c.width).join(' ') }}
        >
            <div className="font-semibold text-dark font-lato flex items-center justify-center">{item.name}</div>
            <div className="text-dark/80 font-lato font-medium flex items-center justify-center">{item.products}</div>
            <div className="flex items-center justify-end gap-2">
                <button className="cursor-pointer px-2 py-1 text-dark/80 hover:text-primary rounded transition-colors">
                    <Eye size={18} />
                </button>
                <button className="cursor-pointer px-2 py-1 text-dark/80 hover:text-primary rounded transition-colors">
                    <Pencil size={18} />
                </button>
                <button className="cursor-pointer px-2 py-1 text-dark/80 hover:text-secondary rounded transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <BaseTable
        title="Categories Management"
        description="Add, edit, and manage auction categories"
        buttonText="Add New Category"
        buttonIcon="./dashboard/plus.svg"
        searchPlaceholder="Search by category name..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortState={sortState}
        onSortChange={toggleSort}
        columns={columns}
        data={data}
        loading={loading}
        onAdd={() => setIsPopupOpen(true)}
        renderRow={renderRow}
        />
    );
}
import { useEffect, useState, useMemo } from "react";
import { Eye, Pencil, Trash2, ChevronRight, ChevronDown, CornerDownRight } from 'lucide-react';
import BaseTable from "./BaseTable";
import api from "../../../utils/axios";
import AddCategoryModel from "../AddCategoryModel";
import EditCategoryModal from "../EditCategoryModel";
import DeleteCategoryModal from "../DeleteCategoryModal";

export default function CategoriesTable({ currentPage, itemsPerPage, onTotalChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [sortState, setSortState] = useState({
        auctionCount: "none",
        category: "none",
    });

    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleSort = (field) => {
        setSortState((prev) => {
            const order = prev[field] === "asc" ? "desc" : prev[field] === "desc" ? "none" : "asc";

            return { auctionCount: "none", category: "none", [field]: order };
        });
    };

    const handleSave = (c) => {
        loadData();
    };

    const buildQueryString = () => {
        const params = new URLSearchParams();

        params.append("page", currentPage);

        // search
        if (searchQuery.trim() !== "") {
            params.append("search", searchQuery.trim());
        }

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

            const res = await api.get(`/admin/categories?${query}`);

            console.log(res);
            const data = res.data;
            onTotalChange(data.pagination.totalPages);
            setData(data.categories);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }

    };

    // Simulate data fetch
    useEffect(() => {
        loadData();
    }, [currentPage, searchQuery, sortState]);

    const visibleData = useMemo(() => {
        const flatten = (nodes, level = 0) => {
            let rows = [];
            nodes.forEach(node => {
                // 1. Add the node itself with its level
                rows.push({ ...node, level });

                // 2. If it is expanded AND has children, recursively add them
                if (expandedRows[node._id] && node.children && node.children.length > 0) {
                    rows = rows.concat(flatten(node.children, level + 1));
                }
            });
            return rows;
        };
        return flatten(data);
    }, [data, expandedRows]);

    const columns = [
        { header: 'Category Name', width: '2fr', sortField: "category"},
        { header: 'No. of Auctions', width: '1fr', sortField: "auctionCount"},
        { header: '', width: '1fr'}
    ];

    const renderRow = (item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedRows[item._id];
        
        // Dynamic indentation based on level
        const paddingLeft = item.level * 40; 
        
        // Background color logic: Darker beige for nested items
        const bgClass = item.level === 0 ? 'bg-transparent' : 'bg-[#f7f3e8]';

        return (
            <div
                key={item._id}
                onClick={() => hasChildren && toggleRow(item._id)}
                className={`grid gap-4 px-6 py-3 border-b border-decor hover:bg-amber-50 transition-colors cursor-pointer ${bgClass}`}
                style={{ gridTemplateColumns: columns.map(c => c.width).join(' ') }}
            >
                {/* Column 1: Name & Tree Controls */}
                <div className="flex items-center" style={{ paddingLeft: `${paddingLeft}px` }}>
                    {/* Icon Area */}
                    <div className="w-8 flex justify-center shrink-0">
                        {hasChildren ? (
                            <button className="p-1 cursor-pointer hover:bg-black/5 rounded text-dark/60">
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        ) : item.level > 0 ? (
                            <CornerDownRight size={16} className="text-dark/30" />
                        ) : null}
                    </div>
                    
                    {/* Category Image */}
                    <div className="w-10 h-10 shrink-0 mr-3 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                        <img 
                            src={item.image_url || "https://placehold.co/100x100?text=No+Img"} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Category Name */}
                    <span className={`font-lato text-dark truncate ${item.level === 0 ? 'font-bold text-base' : 'font-medium text-sm text-dark/80'}`}>
                        {item.name}
                    </span>
                </div>

                {/* Column 2: Product Count */}
                <div className="text-dark/80 font-lato font-medium flex items-center justify-center">
                    {item.auctionCount}
                </div>

                {/* Column 3: Actions */}
                <div className="flex items-center justify-end gap-2 mr-6" onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        setIsEditOpen(true);
                        setEditingCategory(item);
                    }}
                    className="cursor-pointer px-2 py-1 text-dark/80 hover:text-primary rounded transition-colors">
                        <Pencil size={18} />
                    </button>
                    <button onClick={() => {
                        setShowDeleteModal(true);
                        setSelectedCategory(item);
                    }} className="cursor-pointer px-2 py-1 text-dark/80 hover:text-secondary rounded transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <BaseTable
                title="Categories Management"
                description="Add, edit, and manage auction categories"
                buttonText="Add New Category"
                buttonIcon="/dashboard/plus.svg" // Fixed path
                searchPlaceholder="Search by category name..."
                columns={columns}
                data={visibleData} // We pass the processed flat data
                loading={loading}
                onAdd={() => setIsCreateOpen(true)}
                renderRow={renderRow}
                // Passing empty sort props or implementing custom sort if needed
                sortState={sortState} 
                onSortChange={toggleSort}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={null}
            />

            <DeleteCategoryModal
                open={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                }}
                onDeleted={() => {
                    setShowDeleteModal(false);
                    setSelectedCategory(null);
                    loadData();
                }}
                item={selectedCategory}
            />

            <AddCategoryModel
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSave={handleSave}
            />

            <EditCategoryModal
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setEditingCategory(null);
                }}
                onSave={handleSave}
                categoryToEdit={editingCategory}
            />
        </>

    );
}
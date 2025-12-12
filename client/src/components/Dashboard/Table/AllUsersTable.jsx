import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import BaseUserTable from "./BaseUserTable";
import api from "../../../utils/axios";
import DeleteUserModal from "../DeleteUserModal";
import ViewUserModal from "../ViewUserModal";
import EditUserModal from "../EditUserModal";

export default function AllUsersTable({ currentPage, itemsPerPage, onTotalChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterRole, setFilterRole] = useState("all");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    

    const [sortState, setSortState] = useState({
        username: "none",
        email: "none",
        createdAt: "none"
    });

    const handleOptionClick = (user, opt) => {
        setSelectedUser(user);

        switch (opt) {
            case "delete":
                setShowDeleteModal(true);
                break;
            case "view":
                setShowViewModal(true);
                break;
            case "edit":
                setShowEditModal(true);
                break;
        
            default:
                break;
        }
    };

    const toggleSort = (field) => {
        setSortState((prev) => {
            const order = prev[field] === "asc" ? "desc" : prev[field] === "desc" ? "none" : "asc";

            return { username: "none", email: "none", createdAt: "none", [field]: order };
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
        if (filterStatus !== "all") params.append("status", filterStatus);
        if (filterRole !== "all") params.append("role", filterRole);

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

            const res = await api.get(`/admin/users?${query}`);

            console.log(res);
            const data = res.data;
            onTotalChange(data.totalPages);
            setData(data.users);
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
    }, [currentPage, searchQuery, filterStatus, filterRole, sortState]);

    const filters = (
        <div className="flex gap-3">
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-decor border-0 rounded-lg font-lato font-medium text-dark/80 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                <option value="all">Status: All</option>
                <option value="active">Status: Active</option>
                <option value="banned">Status: Banned</option>
            </select>

            <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2.5 bg-decor font-lato font-medium border-decor border-0 rounded-lg text-dark/80 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                <option value="all">Role: All</option>
                <option value="seller">Role: Seller</option>
                <option value="bidder">Role: Bidder</option>
                <option value="admin">Role: Admin</option>
            </select>
        </div>
    );

    const columns = [
        { header: 'USER', width: '3fr', sortField: "username" },
        { header: 'EMAIL', width: '2fr', sortField: "email" },
        { header: 'ROLE', width: '1fr' },
        { header: 'STATUS', width: '1fr' },
        { header: 'DATE JOINED', width: '2fr', sortField: "createdAt" },
        { header: '', width: '1fr' }
    ];

    const renderRow = (item) => (
        <div
        key={item._id}
        className="grid gap-4 px-6 py-[0.565rem] border-2 border-b border-decor hover:bg-amber-50 transition-colors"
        style={{ gridTemplateColumns: columns.map(c => c.width).join(' ') }}
        >
            <div className="font-semibold text-dark font-lato flex items-center ml-16 gap-2">
                <img src={item.avatar_url ? item.avatar_url : "/default_person.webp"} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full" />
                {item.username.length > 20 ? item.username.slice(0, 20) + "..." : item.username}
            </div>
            <div className="font-medium text-dark/80 font-lato flex items-center justify-center">{item.email.length > 20 ? item.email.slice(0, 20) + "..." : item.email}</div>
            <div className="font-medium text-dark/80 font-lato flex items-center justify-center">{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</div>
            <div className="flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'active' ? 'bg-green-200 text-[#34A853]' : 'bg-red-200 text-secondary'
                }`}>
                    {item.status === 'active' ? 'Active' : 'Banned'}
                </span>
            </div>
            <div className="font-medium text-dark font-lato flex items-center justify-center">{new Date(item.createdAt).toLocaleDateString()}</div>
            <div className="flex items-center justify-end gap-1">
                <button onClick={() => handleOptionClick(item, "view")} className="cursor-pointer p-2 text-dark/80 hover:text-primary rounded transition-colors">
                    <Eye size={18} />
                </button>
                <button onClick={() => handleOptionClick(item, "edit")} className="cursor-pointer p-2 text-dark/80 hover:text-primary rounded transition-colors">
                    <Pencil size={18} />
                </button>
                <button onClick={() => handleOptionClick(item, "delete")} className="cursor-pointer p-2 text-dark/80 hover:text-secondary rounded transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <>
            <BaseUserTable
            searchPlaceholder="Search by username or email..."
            filters={filters}
            columns={columns}
            data={data}
            loading={loading}
            onAdd={() => console.log('Add user')}
            renderRow={renderRow}
            sortState={sortState}
            onSortChange={toggleSort}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            />

            <DeleteUserModal
                open={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                }}
                onDeleted={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                    loadData();
                }}
                user={selectedUser}
            />

            <ViewUserModal 
                open={showViewModal}
                onClose={() => setShowViewModal(false)}
                miniuser={selectedUser}
            />

            <EditUserModal 
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                miniuser={selectedUser}
                onUserUpdated={loadData}
            />

        </>
    );
}
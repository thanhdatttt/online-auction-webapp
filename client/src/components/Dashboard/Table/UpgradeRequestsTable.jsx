import { useEffect, useState } from "react";
import BaseUserTable from "./BaseUserTable";
import api from "../../../utils/axios";

export default function UpgradeRequestsTable({ currentPage, itemsPerPage, onTotalChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState("");

    const [sortState, setSortState] = useState({
        username: "none",
        requestedAt: "none"
    });

    const toggleSort = (field) => {
        setSortState((prev) => {
            const order = prev[field] === "asc" ? "desc" : prev[field] === "desc" ? "none" : "asc";

            return { username: "none", requestedAt: "none", [field]: order };
        });
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

            const res = await api.get(`/admin/requestRole?${query}`);

            console.log(res);
            const data = res.data;
            onTotalChange(data.totalPages);
            setData(data.requests);
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

    const columns = [
        { header: 'USER', width: '4fr', sortField: "username" },
        { header: 'REQUEST DATE', width: '3fr', sortField: "requestedAt" },
        { header: '', width: '3fr' }
    ];

    const renderRow = (item, refetch) => {
        const handleApprove = async () => {
            try {
                const res = await api.post(`/admin/requestRole/approve/${item._id}`);
                // console.log(res);
                if (res.status === 200)
                    refetch(); // reload table
            } catch (err) {
                console.error(err);
            }
        };

        const handleDeny = async () => {
            try {
                const res = await api.post(`/admin/requestRole/deny/${item._id}`);
                
                if (res.status === 200)
                    refetch(); // reload table
            } catch (err) {
                console.error(err);
            }
        };

        return (
            <div
            key={item._id}
            className="grid gap-4 px-6 py-[0.5rem] border-2 border-b border-decor hover:bg-amber-50 transition-colors"
            style={{ gridTemplateColumns: columns.map(c => c.width).join(' ') }}
            >
                <div className="font-semibold text-dark font-lato flex items-center ml-32 gap-2">
                    <img src={item.user.avatar_url ? item.user.avatar_url : "/default_person.webp"} referrerPolicy="no-referrer" className="w-[2rem] h-[2rem] rounded-full" />
                    {item.user.username.length > 20 ? item.user.username.slice(0, 20) + "..." : item.user.username}
                </div>
                <div className="text-dark/80 font-lato font-medium flex items-center justify-center">{new Date(item.requestedAt).toLocaleDateString()}</div>
                <div className="flex items-center justify-end gap-2 mr-7">
                    <button onClick={handleApprove} className="cursor-pointer px-4 py-2 bg-primary text-light rounded-lg text-sm font-lato font-medium hover:bg-orange-600 transition-colors">
                        Approve
                    </button>
                    <button onClick={handleDeny} className="cursor-pointer px-4 py-2 bg-secondary text-light rounded-lg text-sm font-lato font-medium hover:bg-red-600 transition-colors">
                        Deny
                    </button>
                </div>
            </div>
        );
    }

    return (
        <BaseUserTable
        searchPlaceholder="Search by username..."
        columns={columns}
        data={data}
        loading={loading}
        onAdd={() => console.log('Add user')}
        renderRow={(item) => renderRow(item, loadData)}
        sortState={sortState}
        onSortChange={toggleSort}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        />
    );
}
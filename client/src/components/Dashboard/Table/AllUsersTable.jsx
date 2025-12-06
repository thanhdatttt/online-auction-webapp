import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import BaseUserTable from "./BaseUserTable";


export default function AllUsersTable({ currentPage, itemsPerPage, onTotalChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('join-date');
    const [filterRole, setFilterRole] = useState('all');

    const userNames = [
        "Heheheh",
        "Fan Thang Ngot",
        "J97 idol cua em",
        "Mì Hảo Hảo tôm chua cay",
        "Dreckiez",
        "abcxyz",
        "DM KEO CON",
        "w123",
        "Cà phê lon Highlands"
    ];

    // Simulate data fetch
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
        const mockData = Array(8).fill(null).map((_, i) => ({
            id: i + 1,
            image: './dashboard/aquafina.jpeg',
            name: userNames[Math.floor(Math.random() * userNames.length)],
            email: 'thangngot@gmail.com',
            role: 'Seller',
            status: i === 1 ? 'blocked' : 'active',
            dateJoined: '2025-11-29'
        }));
        setData(mockData);
        onTotalChange(243);
        setLoading(false);
        }, 500);
    }, []);

    const filters = (
        <div className="flex gap-3">
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-decor border-0 rounded-lg font-lato font-medium text-dark/80 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                <option value="all">Status: All</option>
                <option value="active">Status: Active</option>
                <option value="blocked">Status: Blocked</option>
            </select>

            <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2.5 bg-decor font-lato font-medium border-decor border-0 rounded-lg text-dark/80 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                <option value="all">Role: All</option>
                <option value="seller">Role: Seller</option>
                <option value="bidder">Role: Bidder</option>
            </select>
        </div>
    );

    const columns = [
        { header: 'USER', width: '3fr' },
        { header: 'EMAIL', width: '2fr' },
        { header: 'ROLE', width: '1fr' },
        { header: 'STATUS', width: '1fr' },
        { header: 'DATE JOINED', width: '2fr' },
        { header: '', width: '1fr' }
    ];

    const renderRow = (item) => (
        <div
        key={item.id}
        className="grid gap-4 px-6 py-[0.565rem] border-2 border-b border-decor hover:bg-amber-50 transition-colors"
        style={{ gridTemplateColumns: columns.map(c => c.width).join(' ') }}
        >
            <div className="font-semibold text-dark font-lato flex items-center ml-16 gap-2">
                <img src={item.image} className="w-[2rem] h-[2rem] rounded-full" />
                {item.name}
            </div>
            <div className="font-medium text-dark/80 font-lato flex items-center justify-center">{item.email}</div>
            <div className="font-medium text-dark/80 font-lato flex items-center justify-center">{item.role}</div>
            <div className="flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'active' ? 'bg-green-200 text-[#34A853]' : 'bg-red-200 text-secondary'
                }`}>
                    {item.status === 'active' ? 'Active' : 'Blocked'}
                </span>
            </div>
            <div className="font-medium text-dark font-lato flex items-center justify-center">{item.dateJoined}</div>
            <div className="flex items-center justify-end gap-1">
                <button className="cursor-pointer p-2 text-dark/80 hover:text-primary rounded transition-colors">
                    <Eye size={18} />
                </button>
                <button className="cursor-pointer p-2 text-dark/80 hover:text-primary rounded transition-colors">
                    <Pencil size={18} />
                </button>
                <button className="cursor-pointer p-2 text-dark/80 hover:text-secondary rounded transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <BaseUserTable
        searchPlaceholder="Search by user name..."
        filters={filters}
        columns={columns}
        data={data}
        loading={loading}
        onAdd={() => console.log('Add user')}
        renderRow={renderRow}
        />
    );
}
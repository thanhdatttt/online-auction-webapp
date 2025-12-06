import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import BaseTable from "./BaseTable";

export default function ProductsTable({ currentPage, itemsPerPage, onTotalChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    const categories = [
        { id: 1, name: 'Arts' },
        { id: 2, name: 'Electronics' },
        { id: 3, name: 'Fashion' },
        { id: 4, name: 'Collectibles' }
    ];

    const productNames = [
        "Nước suối Aquafina 500ml",
        "Nước ngọt Coca-Cola lon",
        "Snack Oishi vị tôm cay",
        "Mì Hảo Hảo tôm chua cay",
        "Trà xanh C2 330ml",
        "Sữa tươi Vinamilk 1L",
        "Bánh Oreo vani",
        "Nước tăng lực Sting dâu",
        "Cà phê lon Highlands"
    ];

    function generateRelativeTime() {
        const days = Math.floor(Math.random() * 5) + 1; // 1–5 days
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);

        return `${days} days ${hours}h ${minutes}m`;
    }

    function generateAbsoluteTime() {
        const date = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000); // within 7 days

        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).toUpperCase(); // JAN 10, 10:00 AM
    }

    // Simulate data fetch
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
        const mockData = Array(9).fill(null).map((_, i) => {
            const randomPrice = Math.floor(Math.random() * (10_000_000_000 - 10_000)) + 10_000;

            return {
                id: i + 1,
                image: './dashboard/aquafina.jpeg',
                name: productNames[Math.floor(Math.random() * productNames.length)],
                status: ['live', 'ended'][i % 2],
                currentBid: randomPrice.toLocaleString("vi-VN"),
                endTime: Math.random() > 0.5 ? generateRelativeTime() : generateAbsoluteTime()
            }
        });
        setData(mockData);
        onTotalChange(156);
        setLoading(false);
        }, 500);
    }, []);

    const filters = (
        <div className="flex gap-3">
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-decor border-0 rounded-lg text-dark/80 font-lato font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                <option value="all">All Status</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
            </select>
            
            <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 bg-decor border-0 rounded-lg text-dark/80 font-lato font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
    );

    const columns = [
        { header: 'Product Name', width: '4fr' },
        { header: 'Current Bid', width: '2fr' },
        { header: 'End Time', width: '2fr' },
        { header: 'Status', width: '2fr' },
        { header: '', width: '2fr' }
    ];

    const renderRow = (item) => (
        <div
        key={item.id}
        className="grid gap-4 px-6 py-[0.565rem] border-2 border-b border-decor hover:bg-amber-50 transition-colors"
        style={{ gridTemplateColumns: columns.map(c => c.width).join(' ') }}
        >
            <div className="font-semibold text-dark font-lato flex gap-2 items-center ml-16">
                <img src={item.image} className="w-[2rem] h-[2rem] rounded-sm" />
                {item.name}
            </div>
            <div className="font-medium text-dark/80 font-lato flex items-center justify-center">{item.currentBid} VNĐ</div>
            <div className="font-medium text-dark/80 font-lato flex items-center justify-center">{item.endTime}</div>
            <div className="flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'live' ? 'bg-green-200 text-[#34A853]' :
                'bg-red-200 text-secondary'
                }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
            </div>
            <div className="flex items-center justify-end gap-2 mr-8">
                <button className="cursor-pointer px-2 py-1 text-dark/80 hover:text-secondary rounded transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <BaseTable
        title="Products Management"
        description="View and manage auction products"
        buttonText="Edit Extension Time"
        buttonIcon="./dashboard/edit-white.svg"
        searchPlaceholder="Search by product name..."
        filters={filters}
        columns={columns}
        data={data}
        loading={loading}
        onAdd={() => console.log('Edit extension')}
        renderRow={renderRow}
        />
    );
}
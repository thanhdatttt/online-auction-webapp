import { useEffect, useState } from "react";
import BaseUserTable from "./BaseUserTable";

export default function UpgradeRequestsTable({ currentPage, itemsPerPage, onTotalChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('latest');

    // Simulate data fetch
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
        const mockData = Array(8).fill(null).map((_, i) => ({
            id: i + 1,
            image: './dashboard/aquafina.jpeg',
            name: 'KeoCon',
            requestDate: '2025-11-29'
        }));
        setData(mockData);
        onTotalChange(6);
        setLoading(false);
        }, 500);
    }, []);

    const columns = [
        { header: 'USER', width: '4fr' },
        { header: 'REQUEST DATE', width: '3fr' },
        { header: '', width: '3fr' }
    ];

    const renderRow = (item) => (
        <div
        key={item.id}
        className="grid gap-4 px-6 py-[0.5rem] border-2 border-b border-decor hover:bg-amber-50 transition-colors"
        style={{ gridTemplateColumns: columns.map(c => c.width).join(' ') }}
        >
            <div className="font-semibold text-dark font-lato flex items-center gap-2">
                <img src={item.image} className="w-[2rem] h-[2rem] rounded-full" />
                {item.name}
            </div>
            <div className="text-dark/80 font-lato font-medium flex items-center">{item.requestDate}</div>
            <div className="flex items-center justify-end gap-2">
                <button className="px-4 py-2 bg-primary text-light rounded-lg text-sm font-lato font-medium hover:bg-orange-600 transition-colors">
                    Approve
                </button>
                <button className="px-4 py-2 bg-secondary text-light rounded-lg text-sm font-lato font-medium hover:bg-red-600 transition-colors">
                    Deny
                </button>
            </div>
        </div>
    );

    return (
        <BaseUserTable
        searchPlaceholder="Search by product name..."
        columns={columns}
        data={data}
        loading={loading}
        onAdd={() => console.log('Add user')}
        renderRow={renderRow}
        />
    );
}
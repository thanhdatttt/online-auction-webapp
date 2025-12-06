import { useState } from 'react';
import { Search, Plus } from 'lucide-react';

export default function BaseUserTable({ searchPlaceholder, filters, columns, data, loading, onAdd, renderRow }) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="flex-1 flex flex-col bg-light overflow-hidden">
            {/* Search and Filters */}
            <div className="px-8 py-4 space-y-3">
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4.25 top-1/2 -translate-y-2 text-dark/60" size={17} />
                        <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-decor border-0 rounded-lg text-dark placeholder-dark/60 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Custom Filters */}
                    {filters}
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 px-8 pb-4 overflow-hidden flex flex-col">
                <div className="bg-light rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden ">
                    {/* Table Header */}
                    <div className="grid gap-4 px-6 py-3 bg-decor border-b border-decor" style={{ gridTemplateColumns: columns.map(c => c.width).join(' ') }}>
                        {columns.map((col, idx) => (
                            <div key={idx} className="text-sm font-regular font-lato text-dark/60 uppercase tracking-wide flex items-center">
                                {col.header}
                            </div>
                        ))}
                    </div>

                    {/* Table Body */}
                    <div className="flex-1 overflow-y-auto border-b border-decor">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-gray-500">Loading...</div>
                            </div>
                        ) : (
                            data.map((item) => renderRow(item))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
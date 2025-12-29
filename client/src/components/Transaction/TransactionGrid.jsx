import TransactionItem from "./TransactionItem.jsx";

const TransactionGrid = ({items, activeTab}) => {
  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-16">
        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === 'buyer' ? <ShoppingBag className="text-slate-300" size={40} /> : <DollarSign className="text-slate-300" size={40} />}
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              No {activeTab === 'buyer' ? 'purchases' : 'sales'} found
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              {activeTab === 'buyer' 
                ? "You haven't won any auctions yet." 
                : "You haven't sold any items yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {items.map((item) => (
              <TransactionItem 
                key={item.id} 
                item={item} 
                role={activeTab} 
                onAction={setSelectedItem} 
              />
            ))}
          </div>
        )}
      </main>

      {selectedItem && (
        <TransactionModal 
          item={selectedItem}
          role={activeTab}
          onClose={() => setSelectedItem(null)}
          onUpdateItem={(updated) => {
            onUpdateItem(updated);
            setSelectedItem(updated);
          }}
        />
      )}
    </>
  );
}

export default TransactionGrid;
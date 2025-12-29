const RoleTab = ({activeTab, onTabChange}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
      <div className="inline-flex p-1.5 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl">
        <button 
          onClick={() => onTabChange('buyer')}
          className={`flex items-center space-x-3 px-8 py-3.5 rounded-xl font-bold transition-all duration-300 ${
            activeTab === 'bidder' 
            ? 'bg-primary text-white shadow-lg shadow-amber-600/20' 
            : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag size={18} />
          <span>Purchases</span>
        </button>
        <button 
          onClick={() => onTabChange('seller')}
          className={`flex items-center space-x-3 px-8 py-3.5 rounded-xl font-bold transition-all duration-300 ${
            activeTab === 'seller' 
            ? 'bg-primary text-white shadow-lg shadow-amber-600/20' 
            : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign size={18} />
          <span>Sales</span>
        </button>
      </div>
    </div>
  );
}

export default RoleTab;
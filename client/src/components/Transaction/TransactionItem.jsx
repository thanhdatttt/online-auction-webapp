import { 
  CheckCircle2, Truck, Clock,X , CreditCard, AlertCircle, User, ArrowUpRight 
} from 'lucide-react';

// transaction status definition
export const TransactionStatus = {
  ENDED: "ENDED",
  WAITING_PAYMENT: "WAITING_PAYMENT",
  WAITING_CONFIRM: "WAITING_CONFIRM",
  SHIPPING: "SHIPPING",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
}

// get status info
const getStatusInfo = (status) => {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, desc: 'Order closed successfully.' };
    case TransactionStatus.SHIPPING:
      return { label: 'In Transit', color: 'bg-blue-100 text-blue-700', icon: Truck, desc: 'Waiting for delivery.' };
    case TransactionStatus.WAITING_CONFIRM:
      return { label: 'Payment Pending', color: 'bg-amber-100 text-amber-700', icon: CreditCard, desc: 'Verifying transaction.' };
    case TransactionStatus.WAITING_PAYMENT:
      return { label: 'Address Needed', color: 'bg-rose-100 text-rose-700', icon: AlertCircle, desc: 'Waiting for payment.' };
    case TransactionStatus.CANCELED:
      return { label: 'Canceled', color: 'bg-rose-100 text-rose-700', icon: X, desc: 'Order canceled'}
    default:
      return { label: 'Ended', color: 'bg-slate-100 text-slate-700', icon: Clock, desc: 'Auction concluded.' };
  }
};

const TransactionItem = ({item, role, onAction}) => {
  const statusInfo = getStatusInfo(item.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:border-amber-500/20 transition-all duration-500 flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
      {/* Thumbnail */}
      <div className="w-full lg:w-56 aspect-4/3 rounded-3xl overflow-hidden shrink-0 relative shadow-xl">
        <img src={item.product.images[0].url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${role === 'buyer' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {role === 'buyer' ? 'PURCHASE' : 'SALE'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grow space-y-5 text-center lg:text-left">
        <div className="flex flex-wrap justify-center lg:justify-start gap-4 items-center">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
            <StatusIcon size={14} className="mr-2" />
            {statusInfo.label}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-3xl font-serif font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h3>
          <p className="text-slate-500 text-sm font-medium line-clamp-1">{statusInfo.desc}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pt-4 border-t border-slate-50">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Total Price
            </p>
            <p className="text-xl font-bold text-slate-900">${item.currentBid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {role === 'buyer' ? 'Seller' : 'Buyer'}
            </p>
            <p className="text-sm font-bold text-slate-700 flex items-center justify-center lg:justify-start">
              <User size={14} className="mr-1.5 text-primary" />
              {role === 'buyer' ? '@AuctizOfficial' : item.winnerId.username}
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="shrink-0 w-full lg:w-auto">
        <button 
          onClick={() => onAction(item, role)}
          className={`w-full lg:w-auto min-w-[200px] h-full px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl ${
            item.status === TransactionStatus.COMPLETED 
            ? 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-white' 
            : 'bg-slate-900 text-white hover:bg-primary shadow-slate-200'
          }`}
        >
          <span>{item.status === TransactionStatus.COMPLETED ? 'Order History' : 'Resolve Status'}</span>
          <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default TransactionItem;
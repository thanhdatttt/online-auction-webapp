import { useState } from 'react';
import { CheckCircle2, Truck, XCircle , CreditCard, AlertCircle, User, ArrowUpRight } from 'lucide-react';
import OrderActionModal from './OrderActionModal.jsx';

// transaction status definition
export const TransactionStatus = {
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
      return { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, desc: 'Order completed.' };
    case TransactionStatus.SHIPPING:
      return { label: 'Delivery', color: 'bg-blue-100 text-blue-700', icon: Truck, desc: 'Waiting for delivery.' };
    case TransactionStatus.WAITING_CONFIRM:
      return { label: 'Waiting seller confirm', color: 'bg-amber-100 text-amber-700', icon: CreditCard, desc: 'Verifying transaction.' };
    case TransactionStatus.CANCELED:
      return { label: 'Canceled', color: 'bg-rose-100 text-rose-700', icon: XCircle, desc: 'Order canceled'};
    case TransactionStatus.WAITING_PAYMENT:
      return { label: 'Waiting payment', color: 'bg-rose-100 text-rose-700', icon: AlertCircle, desc: 'Waiting for payment.' };
    default:
      return { label: 'Waiting payment', color: 'bg-rose-100 text-rose-700', icon: AlertCircle, desc: 'Waiting for payment.' };
  }
};

const OrderCard = ({order}) => {
  // modal state
  const [open, setOpen] = useState(false);

  // order status
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  // card status
  const isCancelled = order.status === TransactionStatus.CANCELED;
  const isInactive = [TransactionStatus.COMPLETED, TransactionStatus.CANCELED].includes(order.status);

  return (
    <div className={`
      group bg-white border border-slate-100 rounded-[2.5rem] p-8 
      hover:shadow-2xl hover:border-amber-500/20 transition-all duration-500 
      flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12 relative overflow-hidden
      ${isCancelled ? 'opacity-70 grayscale-[0.8]' : ''}
    `}>
      {/* Visual Void Stamp for Cancelled Items */}
      {isCancelled && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] pointer-events-none z-0 opacity-10">
          <span className="text-[12rem] font-black text-rose-500 border-20 border-rose-500 px-20 py-10 rounded-[4rem]">CANCELED</span>
        </div>
      )}

      {/* Thumbnail */}
      <div className="w-full lg:w-56 aspect-4/3 rounded-3xl overflow-hidden shrink-0 relative shadow-xl z-10">
        <img src={order.auctionId.product.image[0].url} alt={order.auctionId.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="grow space-y-5 text-center lg:text-left z-10">
        <div className="flex flex-wrap justify-center lg:justify-start gap-4 items-center">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
            <StatusIcon size={14} className="mr-2" />
            {statusInfo.label}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-3xl font-serif font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{order.auctionId.title}</h3>
          <p className="text-slate-500 text-sm font-medium line-clamp-1">{statusInfo.desc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Final Price
            </p>
            <p className="text-xl font-bold text-slate-900">${order.finalPrice}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Winner
            </p>
            <p className="text-sm font-bold text-slate-700 flex items-center justify-center lg:justify-start">
              <User size={14} className="mr-1.5 text-amber-500" />
              {order.buyerId?.username}
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="shrink-0 w-full lg:w-auto z-10">
        <button 
          onClick={() => setOpen(true)}
          className={`w-full lg:w-auto min-w-[200px] h-full px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl ${
            isInactive 
            ? 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-white' 
            : 'bg-slate-900 text-white hover:bg-amber-600 shadow-slate-200'
          }`}
        >
          <span>{isInactive ? 'Order History' : 'Resolve'}</span>
          <ArrowUpRight size={18} />
        </button>
      </div>
      
      {/* open modal */}
      {open && (
        <OrderActionModal order={order} onClose={() => setOpen(false)}/>
      )}
    </div>
  );
}

export default OrderCard;
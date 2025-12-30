import { useAuthStore } from "../../stores/useAuth.store.js";
import { useOrderStore } from "../../stores/useOrder.store.js";
import { TransactionStatus } from "./OrderCard.jsx";
import {
  X,MapPin, CreditCard, Truck, CheckCircle, ArrowRight, ShieldCheck, AlertTriangle, XCircle
} from 'lucide-react';

const OrderActionModal = ({order, onClose}) => {
  const { payOrder, shipOrder, confirmReceived, cancelOrder } = useOrderStore();
  const user = useAuthStore((state) => state.user);
  const role = order.sellerId == user._id ? "seller" : "bidder";

  // states
  const [shipAddress, setShipAddress] = useState(user.address);
  const [trackingCode, setTrackingCode] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // status and steps
  const status = order.status || TransactionStatus.WAITING_PAYMENT;
  const steps = [
    { label: 'Payment', icon: CreditCard, active: status === TransactionStatus.WAITING_PAYMENT },
    { label: 'Confirm and Shipping', icon: Truck, active: status === TransactionStatus.WAITING_CONFIRM },
    { label: 'Receipt', icon: CheckCircle, active: status === TransactionStatus.SHIPPING },
  ];

  // complete action
  const handleComplete = () => {
    confirmReceived(order._id);
    onClose();
  }

  // cancel action
  const canCancel = role === 'seller' && status !== TransactionStatus.COMPLETED && status !== TransactionStatus.CANCELED;
  const handleCancel = () => {
    cancelOrder(order._id);
    setShowCancelConfirm(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status === TransactionStatus.CANCELED ? 'bg-rose-500' : 'bg-amber-500'}`}>
              {status === TransactionStatus.CANCELED ? <XCircle className="text-white" size={24} /> : <ShieldCheck className="text-slate-900" size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold">
                {status === TransactionStatus.CANCELED ? 'Transaction Canceled' : 'Escrow Management'}
              </h2>
            </div>
          </div>

          {/* (Hide if cancelled) */}
          {status !== TransactionStatus.CANCELED && (
            <div className="flex justify-between items-center relative px-4">
              <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800 -z-10" />
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step.active ? 'bg-amber-500 text-slate-900 scale-110 shadow-lg shadow-amber-500/30' : 
                    steps.findIndex(s => s.active) > idx ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {steps.findIndex(s => s.active) > idx ? <CheckCircle size={16} /> : <step.icon size={16} />}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${step.active ? 'text-amber-500' : 'text-slate-600'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Content Body */}
        <div className="p-10 max-h-[60vh] overflow-y-auto">
          {/* Canceled */}
          {status === TransactionStatus.CANCELED ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-100">
                <AlertTriangle size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">Transaction Cancelled</h3>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">
                This transaction has been officially cancelled. All financial commitments are released and the product has been returned to the seller's catalog.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Payment */}
              {status === TransactionStatus.WAITING_PAYMENT && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center space-x-3 mb-6">
                    <MapPin size={20} className="text-amber-600" />
                    <h3 className="text-xl font-bold text-slate-900">Payment and Delivery</h3>
                  </div>
                  {role === 'bidder' ? (
                    <div className="space-y-6">
                      <p className="text-slate-500 text-sm">Where should we deliver your acquisition? Our white-glove service requires a full physical address.</p>
                      <textarea
                        value={shipAddress}
                        onChange={(e) => setShipAddress(e.target.value)}
                        placeholder="Enter your address"
                        className="w-full border-2 border-slate-100 rounded-2xl p-6 focus:border-amber-500 focus:outline-none transition-all h-32 resize-none text-slate-100 font-medium placeholder:text-slate-300"
                      />
                      <button
                        onClick={() => payOrder(order._id, shipAddress)}
                        disabled={!shipAddress.trim()}
                        className="w-full bg-slate-900 text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-30 shadow-2xl shadow-slate-900/20"
                      >
                        <span>Confirm payment and shipping data</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-8 rounded-4xl text-center border border-dashed border-slate-200">
                      <div className="animate-pulse text-slate-400 font-bold text-sm uppercase tracking-widest">Waiting for winner payment and shipping data</div>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm payment */}
              {status === TransactionStatus.WAITING_CONFIRM && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  {role === 'seller' ? (
                    <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl">
                      <h3 className="text-xl font-bold text-amber-900 mb-2">Verify Funds</h3>
                      <p className="text-sm text-amber-700 mb-8">Has the wire transfer for <span className="font-bold">${order.auctionId.title}</span> arrived? Once confirmed, the deal proceeds to shipping.</p>
                      <div className="space-y-6">
                        <p className="text-slate-500 text-sm">Enter tracking code for the delivery order</p>
                        <textarea
                          value={trackingCode}
                          onChange={(e) => setTrackingCode(e.target.value)}
                          placeholder="Enter tracking code"
                          className="w-full border-2 border-slate-100 rounded-2xl p-6 focus:border-amber-500 focus:outline-none transition-all h-32 resize-none text-slate-100 font-medium placeholder:text-slate-300"
                        />
                        <button
                          onClick={() => shipOrder(order._id, trackingCode)}
                          disabled={!trackingCode.trim()}
                          className="w-full bg-slate-900 text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-30 shadow-2xl shadow-slate-900/20"
                        >
                          <span>Confirm Receipt of Funds</span>
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                       <CreditCard className="mx-auto text-amber-500 mb-4 animate-bounce" size={40} />
                       <h4 className="text-xl font-bold text-slate-900 mb-2">Verifying Payment</h4>
                       <p className="text-slate-500 text-sm">The seller is currently verifying the funds in escrow.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm receipt */}
              {status === TransactionStatus.SHIPPING && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Handover Complete</h3>
                  <p className="text-slate-500 text-sm mb-8">The transaction has been successfully closed and ownership has been transferred.</p>
                  <button onClick={handleComplete} className="w-full py-4 border-2 border-slate-100 rounded-xl font-bold hover:bg-slate-50 transition-all">
                    Confirm and Close
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Seller cancel controls */}
        {canCancel && (
          <div className="p-8 bg-slate-50 border-t border-slate-100">
            {!showCancelConfirm ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-400">
                  <AlertTriangle size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Administrative Actions</span>
                </div>
                <button 
                  onClick={() => setShowCancelConfirm(true)}
                  className="text-rose-500 hover:text-rose-700 text-[10px] font-black uppercase tracking-widest border-b border-rose-200 pb-0.5 transition-all"
                >
                  Cancel Order
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center space-x-3 text-rose-600 mb-2">
                  <XCircle size={18} />
                  <h4 className="font-black text-xs uppercase tracking-widest">Terminate Transaction?</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Terminating this transaction will void the winning bid and return the asset to active marketplace status. This cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleCancel}
                    className="grow bg-rose-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 uppercase tracking-widest"
                  >
                    Confirm Termination
                  </button>
                  <button 
                    onClick={() => setShowCancelConfirm(false)}
                    className="grow bg-white text-slate-600 py-3 rounded-xl font-bold text-xs border border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest"
                  >
                    Keep Transaction
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderActionModal;
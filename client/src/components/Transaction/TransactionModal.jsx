import { useState } from 'react';
import { X, MapPin, CreditCard, Truck, CheckCircle, ArrowRight, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TransactionStatus } from './TransactionItem.jsx';


const TransactionModal = ({item, onClose, onUpdateItem}) => {
  const [address, setAddress] = useState(item.transaction?.address || '');
  const [invoiceAmount, setInvoiceAmount] = useState(item.transaction?.shippingInvoiceAmount || 0);

  const status = item.status || TransactionStatus.WAITING_PAYMENT;

  const steps = [
    { label: 'Payment', icon: CreditCard, active: status === TransactionStatus.WAITING_PAYMENT},
    { label: 'Confirmation', icon: CheckCircle, active: status === TransactionStatus.WAITING_CONFIRM },
    { label: 'Shipping', icon: Truck, active: status === TransactionStatus.SHIPPING },
    { label: "Completed", icon: CheckCircle2, active: status === TransactionStatus.COMPLETED},
    { label: 'Canceled', icon: X, active: status === TransactionStatus.CANCELED},
  ];

  const updateStatus = (newStatus, extraData= {}) => {
    onUpdateItem({
      ...item,
      status: newStatus,
      transaction: { ...item.transaction, ...extraData }
    });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-slate-900" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold">Secure Checkout</h2>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Transaction for {item.title}</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex justify-between items-center relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800 -z-10" />
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step.active ? 'bg-amber-500 text-slate-900 scale-110 shadow-lg shadow-amber-500/20' : 
                  steps.findIndex(s => s.active) > idx ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  <step.icon size={18} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step.active ? 'text-amber-500' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-10">
          {status === TransactionStatus.ADDRESS_PENDING && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-slate-900">
                <MapPin size={20} className="text-amber-600" />
                <h3 className="text-xl font-bold">Delivery Destination</h3>
              </div>
              <p className="text-slate-500 text-sm">Please provide the physical address where the masterpiece should be delivered.</p>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full Street Address, Apartment, City, Postal Code..."
                className="w-full border-2 border-slate-100 rounded-2xl p-6 focus:border-amber-500 focus:outline-none transition-all h-32 resize-none text-slate-700 font-medium"
              />
              <button
                onClick={() => updateStatus(TransactionStatus.PAYMENT_CONFIRMATION_PENDING, { address })}
                disabled={!address.trim()}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>Confirm Address</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {status === TransactionStatus.PAYMENT_CONFIRMATION_PENDING && (
            <div className="space-y-8">
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <User size={18} className="text-amber-600" />
                  <span className="text-xs font-black text-amber-900 uppercase tracking-widest">Simulating Seller View</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Payment Receipt</h3>
                <p className="text-sm text-slate-600 mb-6">As the seller, please confirm when the funds for the item have been received in your account.</p>
                <button
                  onClick={() => updateStatus(TransactionStatus.SHIPPING_INVOICE_PENDING)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  Confirm Payment Received
                </button>
              </div>
              <div className="text-center">
                <div className="inline-block animate-pulse text-slate-400 text-sm font-medium">
                  Waiting for seller to verify payment...
                </div>
              </div>
            </div>
          )}

          {status === TransactionStatus.SHIPPING_INVOICE_PENDING && (
            <div className="space-y-8">
              <div className="p-6 bg-slate-900 text-white rounded-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Truck size={18} className="text-amber-500" />
                  <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Simulating Seller View</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Issue Shipping Invoice</h3>
                <p className="text-sm text-slate-400 mb-6">Calculate white-glove shipping costs for the provided address and notify the winner.</p>
                
                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Shipping Cost (USD)</label>
                  <input 
                    type="number" 
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => updateStatus(TransactionStatus.RECEIPT_PENDING, { shippingInvoiceAmount: invoiceAmount })}
                  className="w-full bg-amber-500 text-slate-900 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all"
                >
                  Send Shipping Invoice
                </button>
              </div>
            </div>
          )}

          {status === TransactionStatus.RECEIPT_PENDING && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-100 p-8 rounded-4xl text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Item is en route!</h3>
                <p className="text-slate-500 mb-8">Shipping Invoice: <span className="font-bold text-slate-900">${item.transaction?.shippingInvoiceAmount}</span></p>
                
                <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                  Once your item arrives and you've inspected its condition, please confirm receipt to close the auction.
                </p>

                <button
                  onClick={() => updateStatus(TransactionStatus.COMPLETED)}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={20} />
                  <span>Confirm Receipt of Goods</span>
                </button>
              </div>
            </div>
          )}

          {status === TransactionStatus.COMPLETED && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">Transaction Successful</h3>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto">The transaction for <span className="text-slate-900 font-bold">{item.title}</span> is now closed. Thank you for using Auctiz.</p>
              <button
                onClick={onClose}
                className="px-12 py-4 border-2 border-slate-100 rounded-xl font-bold hover:border-amber-500 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
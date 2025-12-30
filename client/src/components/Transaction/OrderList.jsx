import { ShoppingBag, DollarSign } from "lucide-react";
import OrderCard from "./OrderCard.jsx";

const OrderList = ({orders, activeTab}) => {
  if (!orders.length) {
    return (
      <div className="text-center py-24 mb-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          {activeTab === 'bidder' ? <ShoppingBag className="text-slate-300" size={40} /> : <DollarSign className="text-slate-300" size={40} />}
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
          No {activeTab === 'bidder' ? 'purchases' : 'sales'} found
        </h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          {activeTab === 'bidder' 
            ? "You haven't won any auctions yet." 
            : "You haven't sold any items yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
        />
      ))}
    </div>
  );
}

export default OrderList;
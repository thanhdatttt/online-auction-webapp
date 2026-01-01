import { useEffect, useState } from "react";
import { useOrderStore } from "../../stores/useOrder.store.js";
import { ShoppingBag, DollarSign } from "lucide-react";
import Loading from "../Loading.jsx";
import Pagination from "./Pagination.jsx";
import TransactionHeader from "./TransactionHeader.jsx";
import RoleTab from "./RoleTab.jsx";
import OrderList from "./OrderList.jsx";

const TransactionLayout = () => {
  const { purchaseOrders, saleOrders, fetchMyPurchases, fetchMySales, loading, limit, purchaseTotalPages, saleTotalPages } = useOrderStore();
  // page state
  const [currentPurchasePage, setCurrentPurchasePage] = useState(1);
  const [currentSalePage, setCurrentSalePage] = useState(1);

  // tab state
  const [activeTab, setActiveTab] = useState("bidder");
  useEffect(() => {
    fetchMyPurchases(currentPurchasePage, limit);
    fetchMySales(currentSalePage, limit);
  }, []);

  const orders = activeTab === "bidder" ? purchaseOrders : saleOrders;

  return (
    <>
      <TransactionHeader/>
      <RoleTab activeTab={activeTab} onTabChange={setActiveTab}/>
      {loading ? <Loading /> : 
        orders.length > 0 ?
        (<div>
          <OrderList orders={orders}/>
          <div className="flex justify-center mt-8">
            {activeTab === "bidder" ? (
              <Pagination currentPage={currentPurchasePage} totalPages={purchaseTotalPages} onPageChange={setCurrentPurchasePage}/>
            ): (
              <Pagination currentPage={currentSalePage} totalPages={saleTotalPages} onPageChange={setCurrentSalePage}/>
            )}
          </div>
        </div>) : (
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
        )
      }
    </>
  );
}

export default TransactionLayout;
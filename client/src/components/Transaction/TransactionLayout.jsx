import { useEffect, useState } from "react";
import { useOrderStore } from "../../stores/useOrder.store.js";
import Loading from "../Loading.jsx";
import TransactionHeader from "./TransactionHeader.jsx";
import RoleTab from "./RoleTab.jsx";
import OrderList from "./OrderList.jsx";

const TransactionLayout = () => {
  const { purchaseOrders, saleOrders, fetchMyPurchases, fetchMySales, loading } = useOrderStore();

  // tab state
  const [activeTab, setActiveTab] = useState("bidder");
  useEffect(() => {
    fetchMyPurchases();
    fetchMySales();
  }, []);

  const orders = activeTab === "bidder" ? purchaseOrders : saleOrders;

  return (
    <>
      <TransactionHeader/>
      <RoleTab activeTab={activeTab} onTabChange={setActiveTab}/>
      {loading ? <Loading /> : 
        <OrderList orders={orders} activeTab={activeTab}/>
      }
    </>
  );
}

export default TransactionLayout;
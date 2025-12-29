import { useState } from "react";
import TransactionHeader from "./TransactionHeader.jsx";
import TransactionItem from "./TransactionItem.jsx";
import TransactionModal from "./TransactionModal.jsx";

const TransactionLayout = () => {
  const [activeTab, setActiveTab] = useState("bidder");
  const [selectedItem, setSelectedItem] = useState(null);

  // action
  const handleAction = (item, role) => {
    setSelectedItem(item);
  }
  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <TransactionHeader/>
      <div className="space-y-6">
        {transactions.map(item => (
          <TransactionItem
            key={item._id}
            item={item}
            role={activeTab}   
            onAction={handleAction}
          />
        ))}
      </div>
    </>
  );
}

export default TransactionLayout;
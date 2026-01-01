import OrderCard from "./OrderCard.jsx";

const OrderList = ({orders}) => {
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
// check order status is valid or not
export const checkOrderStatus = (order, allowStatuses) => {
    if (!allowStatuses.includes(order.status)) {
        throw new Error(`Invalid order status. Current: ${order.status}`);
    }
}
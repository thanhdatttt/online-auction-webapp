import { ORDER_STATUS } from "../models/Order.js";

// check order status is valid or not
export const checkOrderStatus = (order, allowStatuses, message) => {
    if (!order) {
        const err = new Error("Order not found");
        err.statusCode = 404;
        throw err;
    }

    if (order.status === ORDER_STATUS.CANCELED) {
        const err = new Error("Order has been canceled");
        err.statusCode = 400;
        throw err;
    }

    if (!allowStatuses.includes(order.status)) {
        const err = new Error(
        message || `Invalid order status: ${order.status}`
        );
        err.statusCode = 400;
        throw err;
    }
}
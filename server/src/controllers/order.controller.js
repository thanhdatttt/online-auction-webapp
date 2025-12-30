import Order, { ORDER_STATUS } from "../models/Order.js";
import { checkOrderStatus } from "../utils/order.utils.js";

// get orders by buyer
export const getMyPurchases = async (req, res) => {
    try {
        const userId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const filter = { buyerId: userId };

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate("auctionId")
                .populate("sellerId", "username")
                .populate("buyerId", "username")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Order.countDocuments(filter),
        ]);

        return res.status(200).json({
            message: "Get purchase orders successfully",
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            orders,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// get orders by seller
export const getMySales = async (req, res) => {
    try {
        const userId = req.user.id;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const filter = { sellerId: userId };

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate("auctionId")
                .populate("sellerId", "username")
                .populate("buyerId", "username")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Order.countDocuments(filter),
        ]);

        return res.status(200).json({
            message: "Get sale orders successfully",
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            orders,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// pay order
export const payOrder = async (req, res) => {
    try {
        const order = req.order;
        checkOrderStatus(order, [ORDER_STATUS.WAITING_PAYMENT], "Order is not waiting for payment");

        const {shipAddress} = req.body;
        if (!shipAddress) {
            return res.status(400).json({
                message: "Missing shipping address",
            });
        }
        order.shipAddress = shipAddress;
        order.paidAt = new Date();
        order.status = ORDER_STATUS.WAITING_CONFIRM;
        await order.save();

        return res.status(200).json({
            message: "Payment submitted",
            order,
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

// confirm that have received money and ship the order
export const shipOrder = async (req, res) => {
    try {
        const order = req.order;
        checkOrderStatus(order, [ORDER_STATUS.WAITING_CONFIRM], "Order is waiting for seller confirmation");

        const {trackingCode} = req.body;
        if (!trackingCode) {
            return res.status(400).json({message: "Missing shipping information"});
        }
        order.trackingCode = trackingCode;
        order.shippedAt = new Date();
        order.sellerConfirmedAt = new Date();
        order.status = ORDER_STATUS.SHIPPING;
        await order.save();

        return res.status(200).json({
            message: "Payment confirmed and order shipped",
            order,
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

// confirm received the order
export const confirmReceived = async (req, res) => {
    try {
        const order = req.order;
        checkOrderStatus(order, [ORDER_STATUS.SHIPPING], "Buyer is not confirmed yet");

        order.buyerConfirmedAt = new Date();
        order.status = ORDER_STATUS.COMPLETED;
        await order.save();

        return res.status(200).json({
            message: "Order completed",
            order,
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

// cancel the order
export const cancelOrder = async (req, res) => {
    try {
        const order = req.order;
        checkOrderStatus(order, [ORDER_STATUS.WAITING_PAYMENT, ORDER_STATUS.WAITING_CONFIRM, ORDER_STATUS.SHIPPING], "Order is not canceled");

        order.status = ORDER_STATUS.CANCELED;
        order.canceledAt = new Date();
        await order.save();

        return res.status(200).json({
            message: "Order canceled successfully",
            order,
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}
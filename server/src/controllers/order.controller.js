import Order, { ORDER_STATUS } from "../models/Order.js";
import { checkOrderStatus } from "../utils/order.utils.js";

// get order 
export const getOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId)
        .populate("buyerId", "username reputation")
        .populate("sellerId", "username reputation")
        .populate("auctionId", "title");
        if (!order) {
            return res.status(400).json({message: "Order not found"});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

// pay order
export const payOrder = async (req, res) => {
    try {
        const order = req.order;
        checkOrderStatus(order, [ORDER_STATUS.WAITING_PAYMENT]);

        const {shipAddress, paymentInvoice} = req.body;
        if (!shipAddress || !paymentInvoice?.url) {
            return res.status(400).json({
                message: "Missing shipping address or payment invoice",
            });
        }
        order.shipAddress = shipAddress;
        order.paymentInvoice = {
            ...paymentInvoice,
            paidAt: new Date(),
        }
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
export const confirmPayment = async (req, res) => {
    try {
        const order = req.order;
        checkOrderStatus(order, [ORDER_STATUS.WAITING_CONFIRM]);

        const {shipInvoice} = req.body;
        if (!shipInvoice?.trackingCode) {
            return res.status(400).json({message: "Missing shipping information"});
        }
        order.shipInvoice = {
            ...shipInvoice,
            shippedAt: new Date(),
        };
        order.sellerConfirmAt = new Date();
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
        checkOrderStatus(order, [ORDER_STATUS.SHIPPING]);

        order.buyerConfirmAt = new Date();
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
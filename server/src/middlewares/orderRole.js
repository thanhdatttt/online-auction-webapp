import Order from "../models/Order.js";

// check if user is the buyer of the auction
export const isBuyer = async (req, res, next) => {
    try {
        const order = await Order.find(req.params.id);
        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        if (order.buyerId.toString() !== req.user.id) {
            return res.status(403).json({message: "Only buyer can do this"});
        }

        req.order = order;
        next();
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

// check if user is the seller of the auction
export const isSeller = async (req, res, next) => {
    try {
        const order = await Order.find(req.params.id);
        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        if (order.sellerId.toString() !== req.user.id) {
            return res.status(403).json({message: "Only seller can do this"});
        }

        req.order = order;
        next();
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}
import mongoose from "mongoose";

export const ORDER_STATUS = {
    WAITING_PAYMENT: "WAITING_PAYMENT",
    WAITING_CONFIRM: "WAITING_CONFIRM",
    SHIPPING: "SHIPPING",
    COMPLETED: "COMPLETED",
    CANCELED: "CANCELED"
}

const orderSchema = new mongoose.Schema({
    auctionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction",
        unique: true,
        required: true,
        index: true,
    },
    sellerId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    finalPrice: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: Object.values(ORDER_STATUS),
        default: ORDER_STATUS.WAITING_PAYMENT,
        index: true,
    },

    // payment bill
    paymentInvoice: {
        url: {
            type: String,
        },
        note: {
            type: String,
        },
        paidAt: {
            type: Date,
        }
    },
    shipAddress: {
        type: String,
    },

    // shipping bill
    shipInvoice: {
        url: {
            type: String,
        },
        trackingCode: {
            type: String,
        },
        shippedAt: {
            type: Date,
        },
    },

    // confirm
    sellerConfirmAt: {
        type: Date,
    },
    buyerConfirmAt: {
        type: Date,
    }
},{
    timestamps: true,
});

export default mongoose.model("Order", orderSchema);
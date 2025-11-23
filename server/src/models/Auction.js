import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        start_price: {
            type: Number,
            required: true
        },
        current_price: {
            type: Number,
            default: null
        },
        buy_now_price: {
            type: Number,
            default: null
        },
        gap_price: {
            type: String,
            required: true,
        },
        start_time: {
            type: Date,
            required: true,
        },
        end_time: {
            type: Date,
            required: true,
        },
        renew_time: {
            type: Date,
            required: true,
        },
        reset_time: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['ongoing', 'ended'],
            default: 'ongoing',
        },
        winner_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Auction', auctionSchema);
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            // required: true,
            default: null,
        },
        name: {
            type: String,
            required: true,
            maxlength: 150,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        main_image_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductImage',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Product = mongoose.model('Product', productSchema);

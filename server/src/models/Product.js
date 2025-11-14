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
            required: true,
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
        status: {
            type: String,
            enum: ['draft', 'active', 'closed'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

const productImageSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        image_url: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const categorySchema = new mongoose.Schema(
    {
        parent_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: null,
        },
        level: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

export const Product = mongoose.model('Product', productSchema);
export const ProductImage = mongoose.model('ProductImage', productImageSchema);
export const Category = mongoose.model('Category', categorySchema);
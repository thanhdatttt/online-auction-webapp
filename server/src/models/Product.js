import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
    }
);

const productSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        categoryId: {
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
        images: {
            type: [imageSchema],
            required: true,
        },
        mainImageId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Product', productSchema);

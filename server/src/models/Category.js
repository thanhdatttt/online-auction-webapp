import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        parentId: {
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

export default mongoose.model('Category', categorySchema);
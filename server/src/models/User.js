import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 100
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["bidder", "seller", "admin"],
            default: "bidder"
        },
        status: {
            type: String,
            enum: ["active", "banned", "pending"],
            default: "active"
        },
        email: {
            type: String,
            unique: true,
            sparse: true,  // allow null + unique
            maxlength: 100
        },
        fullname: {
            type: String,
            trim: true,
            maxlength: 150,
            default: null,
        },
        address: {
            type: String,
            trim: true,
            maxlength: 150,
            default: null,
        },
        birth: {
            type: Date,
            default: null
        },
        avatar_url: {
            type: String,
            default: null
        },
        refreshToken: {
            type: String,
            default: null
        },
    },
    { timestamps: true } // => auto adds createdAt & updatedAt
);

// hash password before saving to database
// userSchema.pre("save", async function(next) {
//     if (!this.isModified("passwordHash"))
//         return next();
//     // hash password
//     this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
//     next();
// });

// compare password
userSchema.methods.comparePassword = function(text) {
    return bcrypt.compare(text, this.passwordHash);
};

export default mongoose.model("User", userSchema);
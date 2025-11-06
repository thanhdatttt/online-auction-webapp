import mongoose from "mongoose";


// Save draft information of a user for propagation request
// They only live in 5 minutes so dont worry about memory perfomance...
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,             
    required: false     // reuse for forgot password     
  },
  hashPassword: {       // we dont need to store username and password if we forgot password
    type: String,
    required: false    // reuse for forgot password
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, 
  }
});

export default mongoose.model("OTP", OTPSchema);
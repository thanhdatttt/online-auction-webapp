import api from "../utils/axios.js";
import axios from "axios";

// update user info api
export const uploadService =  {
  getSignature: async () => {
    try {
      const res = await api.get("/upload/sign");
      return res.data;
      } catch (err) {
        console.log(err);
        throw err;
    }
  },

  getAvatarSignature: async () => {
    try {
      const res = await api.get("/upload/sign/avatar");
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  uploadImage: async (file, signatureData) => {
    try {
      const { signature, timestamp, folder, transformation, cloudName, apiKey } = signatureData;
      const formData = new FormData();
      console.log(file);
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);
      if (transformation) {
        formData.append("transformation", transformation);
      }
      
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
        );

      console.log(cloudinaryResponse);
      return cloudinaryResponse.data.secure_url;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
}
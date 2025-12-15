import cloudinary from 'cloudinary';
import { config } from "../configs/config.js";

export const getUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.round((new Date).getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: 'auctions',
    }, config.CLOUD_API_SECRET);

    res.status(200).json({
      signature,
      timestamp,
      folder: 'auctions',
      cloudName: config.CLOUD_NAME,
      apiKey: config.CLOUD_API_KEY
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to sign upload ', error: error.message });
  }
};

export const getAvatarUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.round((new Date).getTime() / 1000);
    
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: 'avatars',
      transformation: "w_300,h_300,c_fill",
    }, config.CLOUD_API_SECRET);

    res.status(200).json({
      signature,
      timestamp,
      folder: "avatars",
      transformation: "w_300,h_300,c_fill",
      cloudName: config.CLOUD_NAME,
      apiKey: config.CLOUD_API_KEY,
    });
  } catch (err) {
    res.status(500).json({message: 'Failed to sign upload ', error: err.message});
  }
}
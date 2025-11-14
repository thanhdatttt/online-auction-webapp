import { config } from "../configs/config.js";
import axios from "axios";
export const verify_captcha = async (captcha) => {
  const secretKey = config.SECRET_KEY;

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

  const response = await axios.post(verifyUrl);
  const { success } = response.data;

  return success;
};

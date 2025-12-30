import api from "../utils/axios.js";

export const orderService = {
  getMyPurchases: async (page=1, limit=9, status=null) => {
    try {
      const res = await api.get("/orders/purchases", {
        params: {page, limit, status}
      });
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  getMySales: async (page=1, limit=9, status=null) => {
    try {
      const res = await api.get("/orders/sales", {
        params: {page, limit, status}
      });
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  payOrder: async (orderId, data) => {
    try {
      const res = await api.put(`/orders/:${orderId}/pay`, data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  shipOrder: async (orderId, data) => {
    try {
      const res = await api.put(`/orders/:${orderId}/ship`, data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  confirmReceived: async (orderId) => {
    try {
      const res = await api.put(`/orders/:${orderId}/confirm-received`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const res = await api.put(`/orders/:${orderId}/cancel`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
import { create } from "zustand";
import { orderService } from "../services/order.service.js";
import { toast } from "sonner";

const replaceOrder = (orders, newOrder) =>
  orders.map(o => (o._id === newOrder._id ? newOrder : o));
const updateOrder = (orders, orderId, updates) =>
  orders.map(order => order._id === orderId ? { ...order, ...updates } : order);

export const useOrderStore = create((set, get) => ({
  loading: false,

  purchaseOrders: [],
  purchasePage: 1,
  purchaseLimit: 9,
  purchaseTotal: 0,
  purchaseTotalPages: 1,

  saleOrders: [],
  salePage: 1,
  saleLimit: 9,
  saleTotal: 0,
  saleTotalPages: 1,
  
  status: null,

  setStatus: (status) => {
    set({status: status});
  },

  fetchMyPurchases: async (page=1, limit=9) => {
    try {
      set({loading: true});

      const {status} = get();
      const res = await orderService.getMyPurchases(page, limit, status);

      set({
        purchaseOrders: res.orders,
        purchasePage: res.page,
        purchaseLimit: res.limit,
        purchaseTotal: res.total,
        purchaseTotalPages: res.totalPages,
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to load purchase orders");
      throw err;
    } finally {
      set({loading: false});
    }
  },

  fetchMySales: async (page=1, limit=9) => {
    try {
      set({loading: true});

      const {status} = get();
      const res = await orderService.getMySales(page, limit, status);
      set({
        saleOrders: res.orders,
        salePage: res.page,
        saleLimit: res.limit,
        saleTotal: res.total,
        saleTotalPages: res.totalPages,
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to load sale orders");
      throw err;
    } finally {
      set({loading: false});
    }
  },

  payOrder: async (orderId, shipAddress) => {
    try {
      set({loading: true});

      const res = await orderService.payOrder(orderId, {shipAddress});
      set(state => ({
        purchaseOrders: updateOrder(state.purchaseOrders, orderId, {
          shipAddress: res.order.shipAddress, 
          paidAt: res.order.paidAt,
          status: res.order.status,
        })
      }));

      toast.success("Payment submitted")
    } catch (err) {
      console.log(err);
      toast.error("Failed to send payment");
      throw err;
    } finally {
      set({loading: false});
    }
  },

  shipOrder: async (orderId, trackingCode) => {
    try {
      set({loading: true});

      const res = await orderService.shipOrder(orderId, {trackingCode});
      set(state => ({
        saleOrders: updateOrder(state.saleOrders, orderId, {
          trackingCode: res.order.trackingCode, 
          sellerConfirmedAt: res.order.sellerConfirmedAt, 
          status: res.order.status,
        })
      }));

      toast.success("Order is shipping");
    } catch (err) {
      console.log(err);
      toast.error("Failed to confirm payment and ship order");
      throw err;
    } finally {
      set({loading: false});
    }
  },

  confirmReceived: async (orderId) => {
    try {
      set({loading: true});

      const res = await orderService.confirmReceived(orderId);
      set(state => ({
        purchaseOrders: updateOrder(state.purchaseOrders, orderId, {
          buyerConfirmedAt: res.order.buyerConfirmedAt,
          status: res.order.status,
        })
      }));

      toast.success("Order completed");
    } catch (err) {
      console.log(err);
      toast.error("Failed to confirm order received");
      throw err;
    } finally {
      set({loading: false});
    }
  },

  cancelOrder: async (orderId) => {
    try {
      set({loading: true});

      const res = await orderService.cancelOrder(orderId);
      set(state => ({
        saleOrders: updateOrder(state.saleOrders, orderId, {
          canceledAt: res.order.canceledAt,
          status: res.order.status,
        })
      }));

      toast.success("Order canceled");
    } catch (err) {
      console.log(err);
      toast.error("Failed to cancel order");
      throw err;
    } finally {
      set({loading: false});
    }
  }
}));
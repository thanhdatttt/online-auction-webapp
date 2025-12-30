import express from "express";
import { shipOrder, confirmReceived, payOrder, getMyPurchases, getMySales, cancelOrder } from "../controllers/order.controller.js";
import {isBuyer, isSeller} from "../middlewares/orderRole.js";

const router = express.Router();

router.get("/purchases", getMyPurchases);
router.get("/sales", getMySales);

router.put("/:id/pay", isBuyer, payOrder);
router.put("/:id/ship", isSeller, shipOrder);
router.put("/:id/confirm-received", isBuyer, confirmReceived);
router.put("/:id/cancel", isSeller, cancelOrder);

export default router;
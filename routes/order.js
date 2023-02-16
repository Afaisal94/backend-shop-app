const express = require("express");
const router = express.Router();

const Order = require("../controllers/Order");

router.get("/", Order.getOrders);
router.get("/:id", Order.getOrderById);
router.post("/", Order.createOrder);
router.delete("/:id", Order.deleteOrder);

module.exports = router;

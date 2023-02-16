const express = require("express");
const router = express.Router();

const Cart = require("../controllers/Cart");

router.get("/", Cart.getCarts);
router.get("/:id", Cart.getCartById);
router.post("/", Cart.createCart);
router.put("/:id", Cart.updateCart);
router.patch("/:id", Cart.updateCart);
router.delete("/:id", Cart.deleteCart);

router.delete("/deleteall/:userid", Cart.deleteCartByUserId);

module.exports = router;

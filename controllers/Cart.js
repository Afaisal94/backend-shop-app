const Cart = require("../models/Cart");

// GET ALL
const getCarts = async (req, res) => {
  const userId = req.query.userId;
  const productId = req.query.productId;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const options = {
    populate: ["product", "user"],
    page: page,
    limit: limit,
  };
  if (userId !== undefined && productId !== undefined) {
    try {
      const carts = await Cart.paginate(
        {
          user: userId,
          product: productId,
        },
        options
      );
      res.status(200).json(carts);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } else if (userId !== undefined && productId === undefined) {
    try {
      const carts = await Cart.paginate(
        {
          user: userId,
        },
        options
      );
      res.status(200).json(carts);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } else {
    try {
      const carts = await Cart.paginate({}, options);
      res.status(200).json(carts);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
};

// GET BY ID
const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById({ _id: req.params.id });
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// CREATE
const createCart = async (req, res) => {
  try {
    const data = new Cart({
      user: req.body.user,
      product: req.body.product,
      quantity: req.body.quantity,
    });
    const cart = await data.save();
    res.status(201).json({
      message: "Cart created successfuly",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// UPDATE
const updateCart = async (req, res) => {
  try {
    const data = req.body;
    const options = { new: true };

    await Cart.findByIdAndUpdate(req.params.id, data, options);
    res.status(201).json({
      message: "Cart updated successfuly",
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// DELETE
const deleteCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Cart deleted successfuly",
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// DELETE ALL
const deleteCartByUserId = async (req, res) => {
  try {
    await Cart.deleteMany({
      user: req.params.userid,
    });
    res.status(200).json({
      message: "Cart deleted successfuly",
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  getCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
  deleteCartByUserId,
};

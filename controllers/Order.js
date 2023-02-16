const Order = require("../models/Order");

// GET ALL
const getOrders = async (req, res) => {
  const userId = req.query.userId;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const options = {
    populate: "user",
    page: page,
    limit: limit,
  };
  if (userId !== undefined) {
    try {
      const orders = await Order.paginate(
        {
          user: userId,
        },
        options
      );
      res.status(200).json(orders);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } else {
    try {
      const orders = await Order.paginate({}, options);
      res.status(200).json(orders);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
};

// GET ONE
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById({ _id: req.params.id });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// CREATE
const createOrder = async (req, res) => {
  try {
    const data = new Order({
      user: req.body.user,
      status: req.body.status,
      recipient: req.body.recipient,
      deliveryAddress: req.body.deliveryAddress,
      totalPrice: req.body.totalPrice,
      orderItem: req.body.orderItem,
      note: req.body.note,

    });
    const order = await data.save();
    res.status(201).json({
      message: "Order created successfuly",
      data: order,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};



// DELETE
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Order deleted successfuly",
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  deleteOrder,
};

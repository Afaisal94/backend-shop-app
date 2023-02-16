const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongooseDateFormat = require("mongoose-date-format");
const mongoosePaginate = require("mongoose-paginate-v2");

const OrderItemSchema = new Schema({
  product: String,
  price: Number,
  quantity: Number,
  subtotal: Number,
});

const orderSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    required: true,
    max: 255,
  },
  recipient: {
    type: String,
    required: true,
    max: 255,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderItem: {
    type: [OrderItemSchema],
    default: undefined,
  },
  note: {
    type: String,
    required: true,
  },
});

orderSchema.plugin(mongoosePaginate);
orderSchema.plugin(mongooseDateFormat);

module.exports = mongoose.model("Order", orderSchema);

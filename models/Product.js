const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255,
  },
  price: {
    type: Number,
  },
  image: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);

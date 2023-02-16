const fs = require("fs");
const path = require("path");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// GET ALL
const getProducts = async (req, res) => {
  const name = req.query.name;
  const category = req.query.category;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const options = {
    populate: "category",
    page: page,
    limit: limit,
  };

  // GET BY CATEGORY ID
  if (category !== undefined) {
    try {
      if (category !== "all") {
        const products = await Product.paginate(
          {
            category: category,
          },
          options
        );
        res.status(200).json(products);
      } else {
        const products = await Product.paginate({}, options);
        res.status(200).json(products);
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }

    // GET ALL & GET BY NAME
  } else {
    let condition = name
      ? { name: { $regex: new RegExp(name), $options: "i" } }
      : {};

    try {
      const products = await Product.paginate(condition, options);
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
};

// GET BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id }).populate({
      path: "category",
      select: "_id name",
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// CREATE
const createProduct = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ message: "No File Uploaded" });

  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ message: "Image must be less than 5 MB" });

  file.mv(`./public/images/${fileName}`, async (error) => {
    if (error) return res.status(500).json({ message: error.message });
    try {
      const createProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        image: fileName,
        imageUrl: url,
      });
      await createProduct.save();
      res.status(201).json({
        message: "Product created successfuly",
        data: createProduct,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// UPDATE
const updateProduct = async (req, res) => {
  const product = await Product.findById({ _id: req.params.id });
  if (!product) return res.status(404).json({ message: "No Data Found" });

  let fileName = "";

  if (req.files === null) {
    fileName = product.image;
  } else {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ message: "Image must be less than 5 MB" });

    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);
    file.mv(`./public/images/${fileName}`, (error) => {
      if (error) return res.status(500).json({ message: error.message });
    });
  }

  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Product.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        image: fileName,
        imageUrl: url,
      }
    );
    res.status(201).json({
      message: "Product updated successfuly",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  try {
    // Delete Product by id
    await Product.deleteOne({ _id: req.params.id });
    // Delete All Cart by Product id
    await Cart.deleteMany({ product: req.params.id });
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

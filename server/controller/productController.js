import fs from "fs";
import ProductModel from "../models/ProductModel.js";
import slugify from "slugify";

import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import Stripe from "stripe";

// payment gateway
// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: "7yzbfwb5qthfy5sb",
//   publicKey: "s5ytkvn6txyxswmy",
//   privateKey: "59c3b20ad73340e39c6a2869adf7004d",
// });

// create product Controller;
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!description) {
      return res.send({ message: "Description is required" });
    }
    if (!price) {
      return res.send({ message: "Price is required" });
    }
    if (!category) {
      return res.send({ message: "Category is required" });
    }
    if (!quantity) {
      return res.send({ message: "Quantity is required" });
    }

    if (photo && photo.size > 1000000) {
      return res.send({
        success: false,
        message: "photo is required and should be less than 1mb",
      });
    }

    const product = await new ProductModel({
      ...req.fields,
      slug: slugify(name),
    });
    console.log(product);
    // save the image to a folder in directory
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

// get All Products

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 })
      .populate("category");
    res.status(200).send({
      success: true,
      message: "All products",
      TotalProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error,
    });
  }
};

// get single product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
    });
  }
};

// get photo product;
export const getPhotoProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
    });
  }
};

// delete product;
export const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteproduct = await ProductModel.findByIdAndDelete(id).select(
      "-photo"
    );
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      deleteproduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
    });
  }
};

// update product;
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!description) {
      return res.send({ message: "Description is required" });
    }
    if (!price) {
      return res.send({ message: "Price is required" });
    }
    if (!category) {
      return res.send({ message: "Category is required" });
    }
    if (!quantity) {
      return res.send({ message: "Quantity is required" });
    }
    if (photo && photo.size > 1000000) {
      return res.status(500).send({
        success: false,
        message: "photo is required and should be less than 1mb",
      });
    }

    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    console.log(product);
    // save the image to a folder in directory
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating product",
      error,
    });
  }
};

// Filter product Controller

export const getFilterproduct = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) {
      args.price = {
        $gte: radio[0],
        $lte: radio[1],
      };
    }
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while filtering products",
    });
  }
};

// Similar Product Controller

export const getSimiliarProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    console.log("Error while filtering product");

    res.status(500).send({
      success: false,
      message: "Error while filtering products",
    });
  }
};

// gateway controllers
// export const paymenttokencontroller = async (req, res) => {
//   try {
//     gateway.clientToken.generate({}, function (err, res) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(res);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while getting token",
//     });
//   }
// };

// export const verifytokenpaymentcontroller = async (req, res) => {
//   try {
//     const { cart, nonce } = req.body;
//     let total = 0;
//     cart.map((item) => {
//       total = total + item.price;
//     });
//     let newTrasanction = await gateway.transaction.sale(
//       {
//         amount: total,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       function (err, result) {
//         if (result) {
//           const order = new orderModel({
//             products: cart,
//             payment: result,
//             buyer: req.user._id,
//           }).save();
//           res.status(200).send({
//             success: true,
//             result,
//             order,
//           });
//         } else {
//           console.log(err);
//           res.status(500).send({
//             success: false,
//             message: "Payment failed",
//           });
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in payment process",
//     });
//   }
// };

// stripe gateway

// const stripe = new Stripe(
//   "sk_test_51OQpi9Kh7tyffymbSoi3c5OwoPZ0KHOfCu1hUD7UEON4IpW1jMKEIx8FFsgozrB8cgrCnteJM9sJRkWowTvbGlMU00wz8s2DLx"
// );

// export const StripePay = async (req, res) => {
//   const { token, cart } = req.body;
//   try {
//     let total = 0;
//     console.log(req.body.token);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: total,
//       currency: "USD",
//       description: "Ecommerce",
//     });
//     const order = new orderModel({
//       products: cart,
//       payment: paymentIntent.amount,
//       buyer: req.user._id,
//     }).save();
//     res.status(200).send({ success: true, order: order });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in payment process",
//     });
//   }
// };

// Check out form
export const CheckoutPayment = async (req, res) => {
  const { products } = req.body;

  let total = 0;
  try {
    products.map((item) => {
      total += item.price;
    });
    const order = await orderModel.create({
      products,
      buyer: req.user._id,
      payment: total,
    });

    res.status(200).send({ success: true, order: order });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in payment process",
    });
  }
};

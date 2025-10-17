// const CodOrder = require("../../models/CodOrder");
// const Cart = require("../../models/Cart");
// const EsewaOrder = require("../../models/EsewaOrder");
// const Product = require("../../models/products");
// const {sendOrderConfirmationEmail} = require("../../helpers/gmail");
// const mongoose = require("mongoose");

// const createCodOrder = async (req, res) => {
//   try {
//     const formData = req.body;
//     console.log("formData in cod", formData)
//     console.log("guestId from formData:", formData.guestId, typeof formData.guestId);

//     if (!formData || formData == null) {
//       return res.status(401).json({
//         success: false,
//         message: "Form Data should be vaild and not be empty!",
//       });
//     }

//     const order =  new CodOrder(formData);

//     //managing out of stock feature

//     for (let item of order.cartItem) {
//       let product = await Product.findById(item.productId);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           messsage: `Not enough stock for this product ${product.title}`,
//         });
//       }

//       for (let colorItem of product.colors) {
//         if (colorItem.code === item.color) {
//           if (colorItem.quantity < item.quantity) {
//             return res.status(400).json({
//               success: false,
//               message: `Not enought stock for ${product.title} in color ${item.color}`,
//             });
//           }
//           colorItem.quantity -= item.quantity;
//         }
//       }

//       //   Recalculation totalStock

//       product.totalStock = product.colors.reduce(
//         (sum, c) => sum + c.quantity,
//         0
//       );

//       product.markModified("colors");

//       await product.save();
//     }

//     //deleting cartItem

//     const getCartId = order.cartId;
//     await Cart.findByIdAndDelete(getCartId);

//     await order.save();
//     await sendOrderConfirmationEmail(order); 

//     res.status(200).json({
//       success: true,
//       message: "Cod order Succcessfully created!",
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Some error occured",
//       error: error.message,
//     });
//   }
// };

// const getAllOrdersByUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("check id in cod order")

//     if (!id) {
//       return res.status(401).json({
//         success: false,
//         message: "UserId not received!",
//       });
//     }

//     let query = {};
//     if(mongoose.Types.ObjectId.isValid(id)) {
//       query = { userId: id}
//     } else {
//       query = { guestId: id}
//     }



//     const order = await CodOrder.find(query).sort({createdAt: -1});
//     console.log("orders chekc in cod corder", order)

//     if(order.length < 0 ) {
//       return res.status(404).json({
//         success: false,
//         message: "No orders found!"
//       })
//     }

//     return res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Some error occured",
//       error: error.message,
//     });
//   }
// };

// const getOrderDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(401).json({
//         success: false,
//         message: "id not received in getOrderDetails of cod!",
//       });
//     }

//     const order = await CodOrder.findById(id);
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "No order found for details in cod!",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Some error occured",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   getOrderDetails,
//   getAllOrdersByUser,
//   createCodOrder,
// };

const CodOrder = require("../../models/CodOrder");
const Cart = require("../../models/Cart");
const Product = require("../../models/products");
const { sendOrderConfirmationEmail } = require("../../helpers/gmail");
const mongoose = require("mongoose");

const createCodOrder = async (req, res) => {
  try {
    const formData = req.body;
    console.log("formData in cod order", formData);
    console.log("guestId from formData in cod order:", formData.guestId, typeof formData.guestId);

    if (!formData || !formData.cartItem || !Array.isArray(formData.cartItem)) {
      return res.status(400).json({
        success: false,
        message: "Form data is invalid or cartItem is missing!",
      });
    }

    const order = new CodOrder(formData);
    console.log("new order created in cod order")

    // Check stock and update product quantities
    // for (let item of order.cartItem) {
    //   if (!item.productId) continue;

    //   const product = await Product.findById(item.productId);
    //   if (!product) {
    //     return res.status(404).json({
    //       success: false,
    //       message: `Product not found for id ${item.productId}`,
    //     });
    //   }

    //   if (!Array.isArray(product.colors)) product.colors = [];

    //   for (let colorItem of product.colors) {
    //     if (colorItem.code === item.color) {
    //       if (colorItem.quantity < item.quantity) {
    //         return res.status(400).json({
    //           success: false,
    //           message: `Not enough stock for ${product.title} in color ${item.color}`,
    //         });
    //       }
    //       colorItem.quantity -= item.quantity;
    //     }
    //   }

    //   // Recalculate total stock
    //   product.totalStock = Array.isArray(product.colors)
    //     ? product.colors.reduce((sum, c) => sum + (c.quantity || 0), 0)
    //     : 0;

    //   product.markModified("colors");
    //   await product.save();
    // }
    await Promise.all(order.cartItem.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
    
      for (let colorItem of product.colors) {
        if (colorItem.code === item.color) {
          if (colorItem.quantity < item.quantity) {
            throw new Error(`Not enough stock for ${product.title} in color ${item.color}`);
          }
          colorItem.quantity -= item.quantity;
        }
      }
    
      product.totalStock = product.colors.reduce((sum, c) => sum + c.quantity, 0);
      product.markModified("colors");
      return product.save();
    }));

    // Delete cart only if cartId exists
    if (order.cartId) {
      await Cart.findByIdAndDelete(order.cartId);
    }

    await order.save();
 
    // Send order confirmation email (non-blocking)
    sendOrderConfirmationEmail(order).catch((err) =>
      console.error("Email send error:", err)
    );

    return res.status(200).json({
      success: true,
      message: "COD order successfully created!",
      data: order,
    });
  } catch (error) {
    console.error("COD order error:", error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "UserId not received!" });
    }

    let query = mongoose.Types.ObjectId.isValid(id) ? { userId: id } : { guestId: id };
    const orders = await CodOrder.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ success: false, message: "Some error occurred", error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Order ID not received!" });

    const order = await CodOrder.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found!" });

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Get order details error:", error);
    return res.status(500).json({ success: false, message: "Some error occurred", error: error.message });
  }
};

module.exports = {
  createCodOrder,
  getAllOrdersByUser,
  getOrderDetails,
};
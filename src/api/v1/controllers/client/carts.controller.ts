// const { getQuantityBySize } = require("../../../../helpers/getQuantityBySize");
import { Request, Response } from "express"
import Cart from "../../models/carts.model";
import Item from "../../models/items.model";
import mongoose from "mongoose"


// [GET] /cart/get-cart/:cartId
module.exports.getCart = async (req: Request, res: Response) => {
  try {
    const cartId = req.params.cartId;

    // Kiểm tra giá trị cartId
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      res.json({
        code: 400,
        message: "Giỏ hàng không hợp lệ",
      });
      return;
    }

    // Tìm giỏ hàng
    const recordsCart = await Cart.findOne({ _id: cartId }).lean();

    if (recordsCart) {
      let totalQuantityProduts = 0;
      if (recordsCart.items.length > 0) {
        for (let item of recordsCart.items) {
          const productId = item.item_id;
          totalQuantityProduts += item.quantity ?? 0;
          // Kiểm tra và lấy thông tin sản phẩm
          const productInfo = await Item.findOne({
            _id: productId,
            deleted: false,
            status: "active",
          }).select("title thumbnail price slug");

          if (productInfo) {
            (item as any).totalPrice = (productInfo.price ?? 0) * (item.quantity ?? 0);
            (item as any).productInfo = productInfo;
          }
        }
      }

      // Tính tổng giá của giỏ hàng
      (recordsCart as any).totalPriceProducts = recordsCart.items.reduce(
        (sum, item) => (item as any).totalPrice + sum,
        0
      );
      (recordsCart as any).totalQuantityProduts = totalQuantityProduts;

      return res.json({
        code: 200,
        message: "Giỏ hàng",
        recordsCart: recordsCart
      });
    } else {
      return res.json({
        code: 201,
        message: "Chưa có giỏ hàng",
      });
    }
  } catch (error) {
    res.json({
      code: 500,
      message: "Đã xảy ra lỗi trong khi lấy giỏ hàng"
    });
  }
};

// [GET] /cart/find/:tokenUser
// module.exports.findCartByUserId = async (req: Request, res: Response) => {
//   const userId = req.user.id;
//   const cart = await Cart.findOne({ user_id: userId });

//   if (cart) {
//     res.json({
//       code: 200,
//       message: "Giỏ hàng",
//       cart: cart
//     });
//   } else {
//     // Không tìm thấy giỏ hàng có user_id
//     res.json({
//       code: 400
//     });
//   }
// }

// // [GET] /cart/create
// module.exports.create = async (req: Request, res: Response) => {
//   try {
//     const newCart = new Cart();
//     await newCart.save();

//     res.json({
//       code: 200,
//       cartId: newCart._id
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create cart" });
//   }

// }

// // [PATCH] /cart/update-user
// module.exports.updateUser = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user.id;
//     const cartId = req.body.cartId;

//     const cart = await Cart.findOne({ user_id: cartId });
//     if (cart) {
//       await Cart.updateOne({
//         _id: cartId
//       }, {
//         user_id: userId
//       });
//     } else {
//       res.json({
//         code: 400,
//         message: "Lỗi id giỏ hàng không chính xác!"
//       });
//       return;
//     }

//     res.json({
//       code: 200,
//       cartId: cart._id
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create cart" });
//   }

// }

// // [PATCH] /cart/add/:productId
// module.exports.addPatch = async (req: Request, res: Response) => {
//   try {
//     const productId = req.params.productId;
//     const quantity = parseInt(req.body.quantity);
//     const cartId = req.body.cartId;
//     const size = req.body.size;

//     const cart = await Cart.findOne({ _id: cartId });

//     const existsProductCart = cart.products.find(item => item.product_id === productId && item.size === size);

//     // const quantitySotck = getQuantityBySize(stockProduct.sizeStock, size);


//     if (existsProductCart) {
//       // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
//       let quantityNew = quantity + existsProductCart.quantity;

//       const stockProduct = await Product.findOne({
//         _id: productId,
//         sizeStock: {
//           $elemMatch: { $regex: `^${size}-` } // ví dụ: "^S-" sẽ match "S-32"
//         }
//       });

//       const quantityStock = getQuantityBySize(stockProduct.sizeStock, size);

//       if (quantityNew > quantityStock) {
//         // Nếu số lượng mới vượt quá số lượng trong kho, đặt số lượng mới bằng số lượng trong kho
//         quantityNew = quantityStock;
//       }

//       await Cart.updateOne({
//         _id: cartId,
//         'products.product_id': productId
//       }, {
//         $set: { 'products.$.quantity': quantityNew }
//       });

//     } else {
//       // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới
//       const objCart = {
//         product_id: productId,
//         quantity: quantity,
//         size: size
//       }
//       await Cart.updateOne({
//         _id: cartId
//       }, {
//         $push: { products: objCart }
//       });
//     }

//     const cartExists = await Cart.findOne({ _id: cartId });
//     let totalQuantityProduts = 0;
//     if (cartExists.products.length > 0) {
//       for (const item of cartExists.products) {
//         totalQuantityProduts += item.quantity;
//       }
//     }

//     res.json({
//       code: 200,
//       message: "Thêm vào giỏ hàng thành công",
//       totalQuantityProduts: totalQuantityProduts
//     });

//   } catch (error) {
//     res.json({
//       code: 400,
//       message: "Lỗi"
//     });
//   }
// }

// // [PATCH] /cart/delete/:idProduct
// module.exports.del = async (req: Request, res: Response) => {
//   try {
//     const productId = req.params.idProduct;
//     const cartId = req.body.cartId;
//     const size = req.body.size;

//     await Cart.updateOne({
//       _id: cartId
//     }, {
//       $pull: { products: { product_id: productId, size: size } }
//     });

//     const cart = await Cart.findOne({ _id: cartId });
//     let totalQuantityProduts = 0;
//     if (cart.products.length > 0) {
//       for (const item of cart.products) {
//         const productId = item.product_id;
//         totalQuantityProduts += item.quantity;
//         // Kiểm tra và lấy thông tin sản phẩm
//         const productInfo = await Product.findOne({
//           _id: productId,
//           deleted: false,
//           status: "active",
//         }).select("title thumbnail price slug discountPercentage");

//         if (productInfo) {
//           // Tính toán giá và tổng giá
//           productInfo.priceNew = (
//             (productInfo.price * (100 - productInfo.discountPercentage)) /
//             100
//           ).toFixed(0);

//           item.totalPrice = productInfo.priceNew * item.quantity;
//           item.productInfo = productInfo;
//         }
//       }
//     }

//     res.json({
//       code: 200,
//       message: "Xóa sản phẩm thành công",
//       totalQuantityProduts: totalQuantityProduts
//     });
//   } catch (error) {
//     res.json({
//       code: 400,
//       message: "Lỗi"
//     });
//   }
// }

// // [PATCH] /cart/update/:idProduct
// module.exports.update = async (req: Request, res: Response) => {
//   try {
//     const productId = req.params.idProduct;
//     const quantity = parseInt(req.body.quantity);
//     const size = req.body.size;
//     const cartId = req.body.cartId;

//     const cartExists = await Cart.findOne({ _id: cartId });
//     if (!cartExists) {
//       return res.json({
//         code: 400,
//         message: "Giỏ hàng không tồn tại"
//       });

//     } else {
//       // Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng hay không
//       const productExists = cartExists.products.find(item => item.product_id === productId && item.size === size);
//       if (!productExists) {
//         // Nếu sản phẩm không tồn tại trong giỏ hàng
//         return res.json({
//           code: 400,
//           message: "Sản phẩm không tồn tại trong giỏ hàng"
//         });
//       } else {
//         // Nếu sản phẩm tồn tại trong giỏ hàng
//         // Kiểm tra số lượng sản phẩm trong kho
//         const stockProduct = await Product.findOne({
//           _id: productId,
//         });

//         const quantityStock = getQuantityBySize(stockProduct.sizeStock, size);

//         if (quantityStock && quantityStock < quantity) {
//           // Nếu số lượng sản phẩm trong kho không đủ
//           await Cart.updateOne({
//             _id: cartId,
//             'products.product_id': productId
//           }, {
//             $set: { 'products.$.quantity': quantityStock }
//           });
//         } else {
//           // Nếu số lượng sản phẩm trong kho đủ
//           await Cart.updateOne({
//             _id: cartId,
//             'products.product_id': productId
//           }, {
//             $set: { 'products.$.quantity': quantity }
//           });
//         }
//       }
//     }

//     const cart = await Cart.findOne({ _id: cartId });
//     let totalQuantityProduts = 0;
//     if (cart.products.length > 0) {
//       for (const item of cart.products) {
//         totalQuantityProduts += item.quantity;
//       }
//     }

//     res.json({
//       code: 200,
//       message: "Cập nhật số lượng thành công",
//       totalQuantityProduts: totalQuantityProduts
//     });

//   } catch (error) {
//     res.json({
//       code: 400,
//       message: "Lỗi"
//     });
//   }
// }
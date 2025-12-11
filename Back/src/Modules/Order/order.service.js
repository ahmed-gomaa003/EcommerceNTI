import CartModel from "../../DB/Models/cart.model.js";
import OrderModel from "../../DB/Models/order.model.js";
import ProductModel from "../../DB/Models/product.model.js";
import UserModel from "../../DB/Models/user.model.js";

export const getAllOrders = async (req, res, next) => {
  const orders = await OrderModel.find().populate(
    "user items.product",
    "userName productName  quantity -_id "
  );

  if (!orders || orders.length === 0)
    return next(new Error("No orders to show", { cause: 404 }));

  return res.status(200).json({ message: "All users Orders", orders });
};

export const getOrderBytrackingNumber = async (req, res, next) => {
  const orders = await OrderModel.findOne({
    trackingNumber: req.params.trackingNumber,
  }).populate("user items.product");

  if (!orders || orders.length === 0)
    return next(new Error("No orders to show", { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: `your order ${orders.trackingNumber} `,
    data: orders,
  });
};

export const createOrder = async (req, res, next) => {
  const userID = req.user._id;
  const cart = await CartModel.findOne({ user: userID });

  const trasnferedProducts = cart.items.map((i) => ({
    product: i.product,
    quantity: i.quantity,
    price: i.price,
  }));

  if (trasnferedProducts.length === 0)
    return next(
      new Error("your cart is empty please add at least one product")
    );

  if (req.body.defaultAddress === "homeAddress") {
    const user = await UserModel.findByIdAndUpdate(
      userID,
      {
        $set: {
          "addresses.homeAddress": {
            ...req.body.homeAddress,
            isDefault: true,
          },
          "addresses.workAddress.isDefault": false,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) return next(new Error("User not found"), { cause: 404 });
  }

  if (req.body.defaultAddress === "workAddress") {
    const user = await UserModel.findByIdAndUpdate(
      userID,
      {
        $set: {
          "addresses.workAddress": {
            ...req.body.workAddress,
            isDefault: true,
          },
          "addresses.homeAddress.isDefault": false,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) return next(new Error("User not found"), { cause: 404 });
  }

  const order = await OrderModel.create({
    user: userID,
    RecipientsName: req.body.fullName,
    items: trasnferedProducts,
    totalPrice: cart.totalCartPrice,
    paymentMethod: req.body?.paymentMethod || "cash",
    shippingAddress:
      req.body.defaultAddress === "homeAddress"
        ? req.body.homeAddress
        : req.body.workAddress,
  });

  for (const item of order.items) {
    const product = await ProductModel.findById(item.product);
    if (!product) continue;

    if (product.stock < item.quantity) {
      return next(
        new Error(`Product ${product.productName} is out of stock`, {
          cause: 400,
        })
      );
    }

    product.stock -= item.quantity;
    await product.save();
  }

  order.totalPrice = cart.totalCartPrice + order.shippingPrice;
  order.populate("user");
  await order.save();

  cart.items = [];

  await cart.save();

  return res
    .status(200)
    .json({ success: true, message: "order placed successfully", data: order });
};

export const getAllUserOrders = async (req, res, next) => {
  const userID = req.user._id;

  const order = await OrderModel.find({ user: userID }).populate(
    "user items.product"
  );

  if (!order)
    return next(new Error("there is no orders for you", { cause: 400 }));

  return res.status(200).json({
    success: true,
    message: "All your orders",
    data: order,
  });
};

export const userCancelOrder = async (req, res, next) => {
  const userID = req.user._id;

  const trackingNumber = req.params.trackingNumber;

  let order = await OrderModel.findOne({
    user: userID,
    trackingNumber: trackingNumber,
  });

  if (!order) return next(new Error("Order not found ", { cause: 400 }));

  if (
    order.status !== "pending" &&
    order.status !== "preparing" &&
    order.status !== "cancelled"
  ) {
    return next(
      new Error("Order can't be cancelled , please contact customer service", {
        cause: 400,
      })
    );
  } else if (order.status === "cancelled") {
    return next(
      new Error("Order already cancelled successfully", {
        cause: 400,
      })
    );
  } else {
    order = await OrderModel.findOneAndUpdate(
      {
        user: userID,
        trackingNumber: trackingNumber,
      },
      { status: "cancelled", isCancelled: true },
      { new: true, runValidators: true }
    );

    for (const item of order.items) {
      const product = await ProductModel.findById(item.product);
      if (!product) continue;

      product.stock += item.quantity;
      await product.save();
    }
    return res.status(200).json({ message: "Order cancelled", order });
  }
};

export const adminCancelOrder = async (req, res, next) => {
  const trackingNumber = req.params.trackingNumber;

  let order = await OrderModel.findOne({
    trackingNumber: trackingNumber,
    isCancelled: false,
  });

  if (!order) return next(new Error("Can't find this order", { cause: 404 }));

  order = await OrderModel.findOneAndUpdate(
    { trackingNumber: trackingNumber, isCancelled: false },
    { status: "cancelled", isCancelled: true },
    { new: true, runValidators: true }
  );
  for (const item of order.items) {
    const product = await ProductModel.findById(item.product);
    if (!product) continue;

    product.stock += item.quantity;
    await product.save();
  }
  return res
    .status(200)
    .json({ message: "order cancelled successfully", order });
};

export const orderPreparing = async (req, res, next) => {
  const trackingNumber = req.params.trackingNumber;
  let order = await OrderModel.findOne({
    trackingNumber: trackingNumber,
    isCancelled: false,
  });

  if (!order) return next(new Error("Order not found", { cause: 404 }));

  order = await OrderModel.findOneAndUpdate(
    { trackingNumber: trackingNumber, isCancelled: false },
    { status: "preparing", isPaid: false },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json({ message: "order preparing successfully", order });
};

export const orderShipped = async (req, res, next) => {
  const trackingNumber = req.params.trackingNumber;
  let order = await OrderModel.findOne({
    trackingNumber: trackingNumber,
    isCancelled: false,
  });

  if (!order) return next(new Error("Order not found", { cause: 404 }));

  order = await OrderModel.findOneAndUpdate(
    { trackingNumber: trackingNumber, isCancelled: false },
    { status: "shipped", isPaid: false, shippingPrice: req.body.shippingPrice },
    { new: true, runValidators: true }
  );

  return res.status(200).json({ message: "order Shipped successfully", order });
};

export const orderDelivered = async (req, res, next) => {
  const trackingNumber = req.params.trackingNumber;
  let order = await OrderModel.findOne({
    trackingNumber: trackingNumber,
    isCancelled: false,
  });

  if (!order) return next(new Error("Order not found", { cause: 404 }));

  order = await OrderModel.findOneAndUpdate(
    { trackingNumber: trackingNumber, isCancelled: false },
    {
      status: "delivered",
      paidAt: Date.now(),
      isPaid: true,
      deliveredAt: Date.now(),
      isDelivered: true,
    },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json({ message: "order delivered successfully", order });
};

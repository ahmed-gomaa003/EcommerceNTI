import CartModel from "../../DB/Models/cart.model.js";
import ProductModel from "../../DB/Models/product.model.js";

const updateCartTotalPrice = (cart) => {
  const totalCartPrice = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  return totalCartPrice;
};

export const getUserCart = async (req, res, next) => {
  const userID = req.user._id;

  let cart = await CartModel.findOne({ user: userID }).populate(
    "user items.product",
    "userName phone addresses productName productDesc price category subCategory images"
  );

  if (!cart) return next(new Error("your cart is empty", { cause: 200 }));

  let priceChanged = false;

  for (let i = 0; i < cart.items.length; i++) {
    const cartItem = cart.items[i];
    const currentPrice = cartItem.product.price;

    if (cartItem.price !== currentPrice) {
      priceChanged = true;
      cartItem.price = currentPrice;
    }
  }

  if (priceChanged) {
    cart.totalCartPrice = updateCartTotalPrice(cart);
    await cart.save();

    return res.status(200).json({
      message: "Price for some products changed",
      data: cart,
    });
  }

  cart.totalCartPrice = updateCartTotalPrice(cart);
  return res
    .status(200)
    .json({ success: true, numberOfCartItems: cart.items.length, data: cart });
};

export const addToCart = async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.body.productId;

  const product = await ProductModel.findById(productId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));

  let cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    if (product.stock < 1)
      return res
        .status(400)
        .json({ message: "No available quantity in stock" });

    cart = await CartModel.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity: 1,
          price: product.price,
        },
      ],
      totalCartPrice: product.price,
    });

    return res.status(201).json({
      success: true,
      numberOfCartItems: cart.items.length,
      data: cart,
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (itemIndex > -1) {
    const oldQuantity = cart.items[itemIndex].quantity;
    const newQuantity = oldQuantity + 1;

    if (newQuantity > product.stock) {
      return res
        .status(400)
        .json({ message: "No available quantity in the stock" });
    }

    cart.items[itemIndex].quantity = newQuantity;
  } else {
    if (product.stock < 1) {
      return res
        .status(400)
        .json({ message: "No available quantity in the stock" });
    }

    cart.items.push({
      product: productId,
      quantity: 1,
      price: product.price,
    });
  }

  cart.totalCartPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  return res.status(201).json({
    success: true,
    message: `Product added Successfully to your cart`,
    data: cart,
  });
};

export const removeFromCart = async (req, res, next) => {
  const userId = req.user._id;

  const productId = req.params._id;

  let cart = await CartModel.findOne({ user: userId });

  if (!cart || cart.items.length === 0)
    return next(new Error("No cart found for this user", { cause: 404 }));

  const itemExists = cart.items.some((i) => i.product.toString() === productId);

  if (!itemExists)
    return next(
      new Error("This product is not exist in this cart", { cause: 404 })
    );
  const filteredProducts = cart.items.filter(
    (i) => i.product.toString() !== productId.toString()
  );
  cart = await CartModel.findByIdAndUpdate(
    cart._id,
    {
      items: filteredProducts,
    },
    { new: true, runValidators: true }
  );
  const totalCartPrice = updateCartTotalPrice(cart);

  cart = await CartModel.findByIdAndUpdate(
    cart._id,
    {
      totalCartPrice: totalCartPrice,
    },
    { new: true, runValidators: true }
  ).populate("items.product");
  return res.status(200).json({
    success: true,
    message: "product removed from your cart",
    numberOfCartItems: cart.items.length,
    data: cart,
  });
};

export const decreaseProductQuantityInCart = async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params._id;

  let cart = await CartModel.findOne({ user: userId }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0)
    return next(new Error("No cart found for this user", { cause: 404 }));

  const itemExists = cart.items.findIndex(
    (i) => i.product._id.toString() === productId.toString()
  );

  if (itemExists === -1)
    return next(new Error("Product not found", { cause: 404 }));

  if (cart.items[itemExists].quantity <= 1) {
    return next(new Error("Minimum quantity is 1"), { cause: 400 });
  }

  cart = await CartModel.findOneAndUpdate(
    { user: userId },
    {
      $inc: {
        [`items.${itemExists}.quantity`]: -1,
      },
    },
    { new: true, runValidators: true }
  );
  const totalCartPrice = updateCartTotalPrice(cart);

  cart = await CartModel.findOneAndUpdate(
    { user: userId },
    { totalCartPrice: totalCartPrice },
    { new: true, runValidators: true }
  ).populate("items.product");
  return res.status(200).json({
    success: true,
    message: "removed one item",
    numberOfCartItems: cart.items.length,
    data: cart,
  });
};

export const increaseProductQuantityInCart = async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params._id;

  let cart = await CartModel.findOne({ user: userId }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0)
    return next(new Error("No cart found for this user", { cause: 404 }));

  const itemExists = cart.items.findIndex(
    (i) => i.product._id.toString() === productId.toString()
  );

  if (itemExists === -1)
    return next(new Error("Product not found", { cause: 404 }));

  cart = await CartModel.findOneAndUpdate(
    { user: userId },
    {
      $inc: {
        [`items.${itemExists}.quantity`]: 1,
      },
    },
    { new: true, runValidators: true }
  );
  const totalCartPrice = updateCartTotalPrice(cart);

  cart = await CartModel.findOneAndUpdate(
    { user: userId },
    { totalCartPrice: totalCartPrice },
    { new: true, runValidators: true }
  ).populate("items.product");
  return res.status(200).json({
    success: true,
    message: "added one item ",
    numberOfCartItems: cart.items.length,
    data: cart,
  });
};

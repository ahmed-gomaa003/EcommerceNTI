import CategoryModel from "../../DB/Models/category.model.js";
import ProductModel from "../../DB/Models/product.model.js";
import subCategoryModel from "../../DB/Models/subCategory.model.js";

export const adminGetAllproducts = async (req, res, next) => {
  const products = await ProductModel.find().populate("category subCategory");

  if (products.length === 0)
    return next(new Error("No products to Show", { cause: 200 }));

  return res
    .status(200)
    .json({ success: true, message: "All products", data: products });
};

export const getAllproducts = async (req, res, next) => {
  let products = res.paginatedResult.results;

  products = products.filter(
    (p) => p.isDeleted === false && p.isActivated === true
  );

  return res.status(200).json({
    success: true,
    message: "Paginated Active Products",
    data: {
      ...res.paginatedResult,
      results: products,
    },
  });
};

export const getAllProductsByCaterory = async (req, res, next) => {
  const category = await CategoryModel.findOne({
    _id: req.params._id,
    isDeleted: false,
  });
  if (!category)
    return next(new Error("Can not find this Category", { cause: 400 }));

  const products = await ProductModel.find({
    category: category._id,
    isActivated: true,
    isDeleted: false,
  }).populate("category");
  if (products.length === 0)
    return next(new Error("No products to Show", { cause: 400 }));

  return res.status(200).json({
    success: true,
    message: "products found in this Category",
    data: products,
  });
};

export const addProduct = async (req, res, next) => {
  try {
    const images = req.files || [];
    const imagePaths = images.map((file) => file.filename);

    const category = await CategoryModel.findOne({ name: req.body.category });
    if (!category)
      return next(new Error("this category is not found", { cause: 400 }));

    const subCategory = await subCategoryModel.findOne({
      name: req.body.subCategory,
    });
    if (!subCategory)
      return next(new Error("this subcategory is not found", { cause: 400 }));

    const product = await ProductModel.create({
      productName: req.body.productName,
      productDesc: req.body.productDesc,
      price: req.body.price,
      stock: req.body.stock,
      discountPrice: req.body.discountPrice,
      images: imagePaths,
      category,
      subCategory,
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  const { _id } = req.params;

  let products = await ProductModel.find();

  if (!products || products.length === 0)
    return next(new Error("No product Found", { cause: 404 }));

  const filtered = products.filter((p) => p._id.toString() === _id);

  if (!filtered) return next(new Error("No product Found", { cause: 404 }));
  return res.status(200).json({
    success: true,
    message: `product : ${products.productName} Found`,
    data: filtered,
  });
};

export const getProductBySlug = async (req, res, next) => {
  const { slug } = req.params;

  const products = await ProductModel.find();
  const slugedProduct = products.filter((p) =>
    p.slug.toLowerCase().includes(slug.toLowerCase())
  );

  if (!products || slugedProduct.length == 0)
    return next(new Error("No product Found", { cause: 404 }));

  return res.status(200).json({
    success: true,
    message: "All matched products",
    data: slugedProduct,
  });
};

export const deleteProductById = async (req, res, next) => {
  const { id } = req.params;

  const deletedproduct = await ProductModel.findOne({ _id: id });
  if (!deletedproduct)
    return next(new Error("product not found to delete", { cause: 404 }));

  if (deletedproduct.isDeleted == true)
    return next(new Error("Product not found", { cause: 404 }));
  if (
    !(await ProductModel.updateOne(
      { _id: deletedproduct._id },
      { isDeleted: true, isActivated: false }
    ))
  )
    return next(new Error(`Failed to delete  ${deletedproduct.productName}`));

  return res.status(200).json({
    message: `product : ${deletedproduct.productName} deleted successfully `,
  });
};

export const updateProductData = async (req, res, next) => {
  const { _id } = req.params;

  const category = await CategoryModel.findOne({ name: req.body.category });
  const subCategory = await subCategoryModel.findOne({
    name: req.body.subCategory,
  });

  if (await ProductModel.findOne({ _id: _id, isDeleted: true }))
    return next(new Error("can not update deleted product", { cause: 400 }));

  const imagePaths = req.files.map((file) => file.filename);
  const product = await ProductModel.findOneAndUpdate(
    { _id: _id },
    {
      productName: req.body.productName,
      productDesc: req.body.productDesc,
      price: req.body.price,
      discountPrice: req.body.discountPrice,
      stock: req.body.stock,
      category: category._id,
      subCategory: subCategory._id,
      images: imagePaths,
    },
    { new: true, runValidators: true }
  );
  if (!product)
    return next(
      new Error(`Failed to update the product : ${product.productName}  `)
    );

  return res.status(200).json({
    success: true,
    message: `product :  ${product.productName} updated successfully`,
    data: product,
  });
};

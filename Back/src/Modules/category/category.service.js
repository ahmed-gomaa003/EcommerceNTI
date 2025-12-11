import CategoryModel from "../../DB/Models/category.model.js";

export const getAllCaterories = async (req, res, next) => {
  const category = await CategoryModel.find({ isDeleted: false });

  if (!category || category.length === 0)
    return next(new Error("No categories found", { cause: 400 }));

  return res
    .status(200)
    .json({ success: true, message: "All Categories  :", data: category });
};

export const addCategory = async (req, res, next) => {
  let category = await CategoryModel.findOne({ name: req.body.name });
  if (category)
    return next(new Error(`This Category : ${category.name}  already exist`));

  category = await CategoryModel.create({
    name: req?.body.name,
    image: req.file?.filename,
  });

  return res
    .status(201)
    .json({ message: "New category added successfully", category });
};

export const getCategoryById = async (req, res, next) => {
  const _id = req.params._id;

  const category = await CategoryModel.findById(_id);

  if (!category || category.length === 0)
    return next(new Error("Category not found", { cause: 404 }));

  return res.status(200).json({ message: "Category found", data: category });
};

export const getCategoryBySlug = async (req, res, next) => {
  const slug = req.params.slug;

  let category = await CategoryModel.find();

  category = category.filter((c) => {
    return c.name.toLowerCase().includes(slug.toLowerCase());
  });
  if (!category || category.length === 0)
    return next(new Error("Category not found", { cause: 404 }));

  return res.status(200).json({ message: "Category found", category });
};

export const removeCategoryById = async (req, res, next) => {
  let category = await CategoryModel.findOne({
    _id: req.params._id,
    isDeleted: false,
  });

  if (!category || category.isDeleted)
    return next(new Error("Category not found to be deleted", { cause: 400 }));

  category.isDeleted = true;
  category.isActive = false;

  await category.save();

  return res
    .status(200)
    .json({ message: "Category deleted successfully", category: category });
};

export const updateCategoryById = async (req, res, next) => {
  let category = await CategoryModel.findOne({
    _id: req.params._id,
    isDeleted: false,
  });

  if (!category)
    return next(new Error("Can't find this category", { cause: 400 }));

  category = await CategoryModel.findByIdAndUpdate(
    { _id: req.params._id, isDeleted: false },
    {
      name: req.body.name,
      image: req.file.filename,
    },
    { new: true, runValidators: true }
  );
  return res
    .status(200)
    .json({ message: "category name updated successfully ", category });
};

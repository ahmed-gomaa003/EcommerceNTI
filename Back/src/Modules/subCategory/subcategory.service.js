import slugify from "slugify";
import CategoryModel from "../../DB/Models/category.model.js";
import subCategoryModel from "../../DB/Models/subCategory.model.js";

export const getAllSubcategories = async (req, res, next) => {
  const subCategory = await subCategoryModel
    .find({ isDeleted: false })
    .populate("category", "name -_id");
  if (!subCategory || subCategory.length === 0)
    return next(new Error("can't found Subcategory ", { cause: 400 }));

  return res
    .status(200)
    .json({ success: true, message: "All subCategories :", data: subCategory });
};

export const addSubcategory = async (req, res, next) => {
  const category = await CategoryModel.findOne({
    _id: req.body.category,
    isDeleted: false,
  });

  if (!category) return next(new Error("Category not found", { cause: 400 }));

  const subCategoryExist = await subCategoryModel.findOne({
    name: req.body.name,
  });

  if (subCategoryExist)
    return next(new Error(`${subCategoryExist.name} already exist`));
  const subcategory = await subCategoryModel.create({
    name: req.body.name,
    category: category._id,
    isActive: req.body.isActive,
  });

  return res.status(201).json({
    success: true,
    message: `${subcategory.name} added successfully`,
    data: subcategory,
  });
};

export const removeSubCategoryById = async (req, res, next) => {
  let subcategory = await subCategoryModel.findOne({
    _id: req.params._id,
    isDeleted: false,
  });

  if (!subcategory)
    return next(new Error(`can't find this subcategory`, { cause: 400 }));

  subcategory.isDeleted = true;

  await subcategory.save();

  return res.status(200).json({
    success: true,
    message: `${subcategory.name} remove successfully `,
  });
};

export const updateSubCategoryById = async (req, res, next) => {
  let subcategory = await subCategoryModel.findOne({
    _id: req.params._id,
    isDeleted: false,
  });
  if (!subcategory)
    return next(new Error(`can't find this subcategory`, { cause: 400 }));

  const category = await CategoryModel.findOne({
    _id: req.body.category,
    isDeleted: false,
  });

  if (!category) return next(new Error("Category not found", { cause: 400 }));

  subcategory = await subCategoryModel.findOneAndUpdate(
    { _id: req.params._id },
    {
      name: req.body.name,
      category: category._id,
      isActive: req.body.isActive,
      slug: slugify(req.body.name),
    },
    { new: true, runValidators: true }
  );
  return res.status(200).json({
    success: true,
    message: `subcategory : ${subcategory.name} updated successfully `,
    data: subcategory,
  });
};

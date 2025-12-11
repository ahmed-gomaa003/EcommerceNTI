import testinomialModel from "../../DB/Models/testinomial.model.js";

export const createTestinomial = async (req, res, next) => {
  const userId = req.user._id;
  const { description } = req.body;

  if (!description)
    return next(new Error("Description is required"), { cause: 400 });
  const testimony = await testinomialModel.create({
    user: userId,
    description,
  });

  return res.status(201).json({
    success: true,
    message: "Testimony submitted successfully",
    data: testimony,
  });
};

export const getAllTestimonies = async (req, res) => {
  const testinomials = await testinomialModel
    .find()
    .populate("user", "email phone")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "All testinomials",
    data: testinomials,
  });
};

export const removeTestimonie = async (req, res) => {
  const { id } = req.params;

  const deleted = await testinomialModel.findByIdAndDelete(id);

  if (!deleted) {
    return res
      .status(404)
      .json({ success: false, message: "Testimonial not found" });
  }

  return res
    .status(200)
    .json({ success: true, message: "Testimonial deleted", data: deleted });
};

export const updateTestimonie = async (req, res) => {
  const { id } = req.params;

  const updated = await testinomialModel.findByIdAndUpdate(
    id,
    { $set: { isApproved: true } },
    { new: true, runValidators: false }
  );

  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Testimonial not found" });
  }

  return res
    .status(200)
    .json({ success: true, message: "Testimonial approved", data: updated });
};

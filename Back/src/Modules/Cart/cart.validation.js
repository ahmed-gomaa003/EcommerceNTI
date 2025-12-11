import joi from "joi";

export const increaseAndDecreaseProductQuantityInCart = joi
  .object({
    _id: joi.string().required(),
    quantity: joi.number().min(1).max(100),
  })
  .required();

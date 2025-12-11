import joi from "joi";
import { generalfields } from "../../middlewares/validation.middleware.js";

export const updateUserSchema = joi
  .object({
    userName: generalfields.UserName,
    addresses: generalfields.addresses,
    phone: generalfields.phone,
    age: generalfields.age,
    DOB: generalfields.DOB,
    gender: generalfields.gender,
  })
  .required();

export const changePasswordSchema = joi
  .object({
    oldPassword: generalfields.password.required(),
    password: generalfields.password.required(),
    confirmPassword: generalfields.confirmPassword.required(),
  })
  .required();

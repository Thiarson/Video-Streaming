const Joi = require("joi")

const loginSchema = Joi.object({
  phone: Joi.string().pattern(new RegExp(/^\d{10}$/)).optional(),
  email: Joi.string().pattern(new RegExp(/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i)).optional(),
  password: Joi.string().min(6).required(),
}).xor("phone", "email")

module.exports = { loginSchema }

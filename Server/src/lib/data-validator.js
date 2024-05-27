const Joi = require("joi")

const loginSchema = Joi.object({
  phone: Joi.string().pattern(new RegExp(/^\d{10}$/)).optional(),
  email: Joi.string().pattern(new RegExp(/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i)).optional(),
  password: Joi.string().min(6).required(),
}).xor("phone", "email")

const signupSchema = Joi.object({
  sex: Joi.string().equal('M', 'F').required(),
  pseudo: Joi.string().min(3).max(30).required(),
  phone: Joi.string().pattern(new RegExp(/^\d{10}$/)).required(),
  email: Joi.string().pattern(new RegExp(/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i)).required(),
  birth: Joi.date().required(),
  password: Joi.string().min(6).required(),
})

module.exports = { loginSchema, signupSchema }

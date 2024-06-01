import Joi from "joi"

const pattern = {
  sex: Joi.string().equal('M', 'F'),
  pseudo: Joi.string().min(3).max(30),
  birth: Joi.date(),
  password: Joi.string().min(6),
  phone: Joi.string().pattern(new RegExp(/^\d{10}$/)),
  email: Joi.string().pattern(new RegExp(/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i)),
}

const loginSchema = Joi.object({
  phone: pattern.phone.optional(),
  email: pattern.email.optional(),
  password: pattern.password.required(),
}).xor("phone", "email")

const signupSchema = Joi.object({
  sex: pattern.sex.required(),
  pseudo: pattern.pseudo.required(),
  phone: pattern.phone.required(),
  email: pattern.email.required(),
  birth: pattern.birth.required(),
  password: pattern.password.required(),
})

export { loginSchema, signupSchema,pattern }

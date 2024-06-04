import mongoose from "mongoose"

const { Schema } = mongoose
const { ObjectId } = Schema

const EmailUserSchema = new Schema({
  userEmail: {
    type: String,
    unique: true,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  }
})

const EmailSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: "EmailUser",
    unique: true,
    required: true,
  },
  emailSubject: {
    type: String,
    required: true,
  },
  emailBody: {
    type: String,
    required: true,
  },
  emailSenderId: {
    type: ObjectId,
    ref: "EmailUser",
    required: true,
  },
  emailReceiverId: {
    type: ObjectId,
    ref: "EmailUser",
    required: true,
  },
  emailCreatedAt: {
    type: Date,
    default: Date.now
  },
  emailDeleted: {
    type: Boolean,
    default: false,
  }
})

const EmailUser = mongoose.model("EmailUser", EmailUserSchema)
const Email = mongoose.model("Email", EmailSchema)

export { EmailUser, Email }

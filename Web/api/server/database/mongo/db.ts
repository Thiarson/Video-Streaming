import mongoose, { Schema } from "mongoose"
import type { Document, ObjectId } from "mongoose"

// Interface pour EmailUser
interface IEmailUser extends Document {
  userEmail: string;
  userPassword: string;
  emailSent: ObjectId[];
  emailReceived: ObjectId[];
}

// Interface pour Email
interface IEmail extends Document {
  emailSubject: string;
  emailBody: string;
  emailSender: ObjectId;
  emailReceiver: ObjectId;
  emailCreatedAt: Date;
  emailDeleted: boolean;
}

const EmailUserSchema: Schema = new Schema({
  userEmail: { type: String, unique: true, required: true, },
  userPassword: { type: String, required: true, },
  emailSent: [{ type: Schema.ObjectId, ref: "Email" }],
  emailReceived: [{ type: Schema.ObjectId, ref: "Email" }],
})

const EmailSchema: Schema = new Schema({
  emailSubject: { type: String, required: true, },
  emailBody: { type: String, required: true, },
  emailSender: { type: Schema.ObjectId, ref: "EmailUser", required: true, },
  emailReceiver: { type: Schema.ObjectId, ref: "EmailUser", required: true, },
  emailCreatedAt: { type: Date, default: Date.now, },
  emailDeleted: { type: Boolean, default: false, }
})

const EmailUser = mongoose.model<IEmailUser>("EmailUser", EmailUserSchema)
const Email = mongoose.model<IEmail>("Email", EmailSchema)

export { EmailUser, Email }

export type { IEmail, IEmailUser }

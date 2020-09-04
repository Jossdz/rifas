const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: String,
    password: String,
    googleID: String,
    photo: {
      type: String,
      default:
        "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
    },
    role: {
      type: String,
      enum: ["ADMIN", "NONP", "COMPANY", "USER"],
      default: "USER"
    },
    address: String,
    donatedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    industry: String,
    tickets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ticket"
      }
    ],
    website: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
)

const User = mongoose.model("User", userSchema)
module.exports = User

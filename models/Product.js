const { Schema, model } = require("mongoose")

const productSchema = new Schema(
  {
    name: String,
    description: String,
    donatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    image: {
      type: String,
      default:
        "https://piotrkowalski.pw/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png"
    },
    category: {
      type: String,
      enum: ["office", "electronics", "accesory", "home", "tools", "vehicle"]
    },
    valid: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = model("Product", productSchema)

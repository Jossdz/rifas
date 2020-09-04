const { Schema, model } = require("mongoose")

const productSchema = new Schema(
  {
    name: String,
    description: String,
    donatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
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

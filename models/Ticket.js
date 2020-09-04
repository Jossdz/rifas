const { Schema, model } = require("mongoose")

const ticketSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    raffle: {
      type: Schema.Types.ObjectId,
      ref: "Raffle"
    }
  },
  { timestamps: true }
)

module.exports = model("Ticket", ticketSchema)

const { Schema, model } = require("mongoose")

const raffleSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product"
    },
    availableTickets: {
      type: Number,
      default: 10
    },
    ticketPrice: Number,
    soldTickets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ticket"
      }
    ]
  },
  { timestamps: true }
)

module.exports = model("Raffle", raffleSchema)

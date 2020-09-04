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
    totalTickets: {
      type: Number,
      default: 10
    },
    ticketPrice: Number,
    soldTickets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ticket"
      }
    ],
    finished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = model("Raffle", raffleSchema)

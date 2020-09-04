const Product = require("../models/Product")
const Raffle = require("../models/Raffle")
const User = require("../models/User")

exports.generateRaffle = async (req, res) => {
  const { price: ticketPrice, ticketQuantity: availableTickets } = req.body
  const { productId: product } = req.params

  await Raffle.create({
    ticketPrice,
    availableTickets,
    product
  })

  await Product.findByIdAndUpdate(product, { valid: true })

  res.redirect("/products/validate")
}

exports.getAllRaffles = async (req, res) => {
  const raffles = await Raffle.find().populate("product")
  res.render("index", { raffles })
}

exports.raffleDetail = async (req, res) => {
  const raffle = await Raffle.findById(req.params.raffleId)
    .populate("product")
    .populate({
      path: "product",
      populate: {
        path: "donatedBy",
        model: "User"
      }
    })
  res.render("raffle/detail", raffle)
}

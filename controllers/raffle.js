const Product = require("../models/Product")
const Raffle = require("../models/Raffle")
const User = require("../models/User")
const mercadopago = require("../config/mercadopago")
const Ticket = require("../models/Ticket")
const { findByIdAndUpdate } = require("../models/Product")

exports.generateRaffle = async (req, res) => {
  const { price: ticketPrice, ticketQuantity: availableTickets } = req.body
  const { productId: product } = req.params

  await Raffle.create({
    ticketPrice,
    availableTickets,
    totalTickets: availableTickets,
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

  const preference = {
    items: [
      {
        title: `Ticket: ${raffle.product.name} raffle`,
        unit_price: raffle.ticketPrice,
        quantity: 1
      }
    ]
  }
  const {
    body: { id: preferenceId }
  } = await mercadopago.preferences.create(preference)
  raffle.preferenceId = preferenceId
  raffle.available = raffle.availableTickets > 0
  res.render("raffle/detail", raffle)
}

exports.boughtTicket = async (req, res) => {
  const { raffleId } = req.params
  const raffle = await Raffle.findOne({ _id: raffleId })

  if (raffle.availableTickets === 0) {
    return res.redirect("/")
  }
  // 1. Generar el ticket
  const ticket = await Ticket.create({
    owner: req.user.id,
    raffle: raffleId
  })
  // 2. restar un ticket de la rifa
  // 3. Agregar el ticket a los tickets vendidos de la rifa

  raffle.availableTickets -= 1
  raffle.soldTickets.push(ticket._id)

  await raffle.save()
  // 4. Agregamos el ticket al user
  await User.findByIdAndUpdate(req.user.id, { $push: { tickets: ticket._id } })
  res.redirect("/profile")
}

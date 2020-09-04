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
  const result = await Raffle.find().populate("product")
  const raffles = result.reverse()
  res.render("index", { raffles })
}

exports.raffleDetail = async (req, res) => {
  const raffle = await Raffle.findById(req.params.raffleId)
    .populate("soldTickets")
    .populate("product")
    .populate({
      path: "product",
      populate: {
        path: "donatedBy",
        model: "User"
      }
    })
    .populate({
      path: "soldTickets",
      populate: {
        path: "owner",
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

exports.endRaffles = async (req, res) => {
  const raffles = await Raffle.find({
    availableTickets: 0,
    finished: false
  }).populate("product")
  res.render("raffle/end", { raffles })
}

exports.setRaffleWinner = async (req, res) => {
  const { raffleId } = req.params
  const raffle = await Raffle.findById(raffleId).populate("soldTickets")
  // 1. obtener a un ganador aleatorio de los soldTickets de la rifa
  const winnerId = Math.floor(Math.random() * raffle.soldTickets.length)
  const ticketWinner = raffle.soldTickets[winnerId]
  console.log("winner:", ticketWinner)
  // 2. cambiar la propiedad winner del ticket seleccionado de forma aleatoria por true
  await Ticket.findByIdAndUpdate(ticketWinner, { winner: true })
  // 3. Enviar el roadster que diego prometio al ganador.
  // 4. cambiar la propiedad finished de la rifa por true
  await Raffle.findByIdAndUpdate(raffleId, { finished: true })
  // 5. redirigir a la misma vista de end raffles
  res.redirect("/raffles/end")
}

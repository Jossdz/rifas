const passport = require("passport")
const User = require("../models/User")

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id)
})

passport.deserializeUser(async (userIdFromSession, cb) => {
  const userDocument = await User.findById(userIdFromSession)
    .populate("tickets")
    .populate({
      path: "tickets",
      populate: {
        path: "raffle",
        model: "Raffle",
        populate: {
          path: "product",
          model: "Product"
        }
      }
    })

  cb(null, userDocument)
})

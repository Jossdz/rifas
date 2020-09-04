const passport = require("passport")
const googleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/User")

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (_, __, profile, done) => {
      const user = await User.findOne({ googleID: profile.id })
      const {
        name: { givenName },
        photos,
        id
      } = profile
      if (!user) {
        const user = await User.create({
          googleID: id,
          photo: photos[0].value,
          name: givenName
        })
        done(null, user)
      }
      done(null, user)
    }
  )
)

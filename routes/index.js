const express = require("express")
const router = express.Router()
const { isAuth, checkRole, catchErrors } = require("../middlewares")
const uploader = require("../config/cloudinary")
const {
  createProduct,
  deleteProduct,
  getInvalidProducts,
  donateView,
  thanks
} = require("../controllers/products")
const {
  generateRaffle,
  getAllRaffles,
  raffleDetail,
  boughtTicket
} = require("../controllers/raffle")

/* GET home page */
router.get("/", catchErrors(getAllRaffles))
router.get("/profile", (req, res) => {
  console.log(req.user.tickets[0].raffle)
  res.render("profile", req.user)
})

//=========PRODUCTS============
router.get(
  "/products/validate",
  isAuth,
  checkRole("ADMIN"),
  catchErrors(getInvalidProducts)
)
router.get("/products/thanks", thanks)
router.get("/products/donate", isAuth, checkRole("COMPANY"), donateView)
router.post(
  "/products/donate",
  isAuth,
  checkRole("COMPANY"),
  uploader.single("image"),
  catchErrors(createProduct)
)

//==========Raffle===============

router.post(
  "/raffle/new/:productId",
  isAuth,
  checkRole("ADMIN"),
  catchErrors(generateRaffle)
)
router.get("/raffle/:raffleId", raffleDetail)
router.post("/bought-ticket/:raffleId", boughtTicket)

module.exports = router

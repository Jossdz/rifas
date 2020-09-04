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
  raffleDetail
} = require("../controllers/raffle")

/* GET home page */
router.get("/", catchErrors(getAllRaffles))

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

module.exports = router

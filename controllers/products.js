const Product = require("../models/Product")

exports.getInvalidProducts = async (req, res) => {
  const products = await Product.find({ valid: false }).populate("donatedBy")
  console.log(products)
  res.render("products/validate", { products })
}

exports.donateView = (req, res) => res.render("products/donate")

exports.thanks = (req, res) => res.render("products/thanks")

exports.createProduct = async (req, res) => {
  // 1. extraer la informacion
  const { name, description, category } = req.body
  const { path: image } = req.file
  const { id: donatedBy } = req.user
  // 2. creamos el producto en base al usuario en sesion
  await Product.create({
    name,
    description,
    category,
    image,
    donatedBy
  })
  res.redirect("/products/thanks")
}
//TODO: exports.updateProduct = (req, res) => {}

exports.deleteProduct = async (req, res) => {
  const { productId } = req.params
  await Product.findByIdAndDelete(productId)
  res.redirect("/products/validate")
}

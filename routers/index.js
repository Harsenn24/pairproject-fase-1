const express = require("express")
const router = express.Router()
const adminRoute = require("./admin")
const clientRoute = require("./client")

const Controller = require("../controllers/controller")

router.get('/', Controller.home)
router.get("/register", Controller.register)
router.post("/register", Controller.registerPost)

router.use("/admin", adminRoute)
router.use("/client", clientRoute)

module.exports = router
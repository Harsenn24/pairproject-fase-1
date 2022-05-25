const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
// const session = require('express-session')


router.get("/login", adminController.login)
router.post("/login", adminController.loginPost)

router.use(function (req, res, next) {
    console.log(req.session);
    if (req.session.UserId) {
      next()
    } else {
      let errors = 'Please Login First'
      res.redirect(`/admin/login?error=${errors}`)
    }
})


router.get("/login/:userId", adminController.showClothes)

router.get("/login/:userId/addProfil", adminController.addProfil)
router.post("/login/:userId/addProfil", adminController.addProfilPost)

router.get("/login/:userId/editProfil", adminController.editProfil)
router.post("/login/:userId/editProfil", adminController.editProfilPost)

router.get("/login/:userId/allUser", adminController.allUser)

router.get("/login/:userId/addClothe", adminController.addClothe)
router.post("/login/:userId/addClothe", adminController.addClothePost)

router.get("/login/:userId/editClothe/:clotheId", adminController.editClothe)
router.post("/login/:userId/editClothe/:clotheId", adminController.editClothePost)

router.get("/login/:userId/deleteClothe/:clotheId", adminController.deleteClothe)

router.get("/login/:userId/stockPlus/:clotheId", adminController.stockPlus)
router.get("/login/:userId/stockMinus/:clotheId", adminController.stockMinus)














module.exports = router 
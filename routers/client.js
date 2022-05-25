const express = require("express")
const router = express.Router()
const clientController = require("../controllers/clientController")

router.get("/login", clientController.login)
router.post("/login", clientController.loginPost)

router.use(function (req, res, next) {
    console.log(req.session);
    if (req.session.UserId) {
      next()
    } else {
      let errors = 'Please Login First'
      res.redirect(`/client/login?error=${errors}`)
    }
})

router.get("/login/:userId", clientController.showClothes)

router.get("/login/:userId/addProfil", clientController.addProfil)
router.post("/login/:userId/addProfil", clientController.addProfilPost)

router.get("/login/:userId/editProfil", clientController.editProfil)
router.post("/login/:userId/editProfil", clientController.editProfilPost)

router.get("/login/:userId/buyClothe", clientController.buyClothe)

router.get("/login/:userId/addWishList/:clotheId", clientController.addClothe)
router.get("/login/:userId/deleteList/:trxId", clientController.deleteClothe)














module.exports = router 
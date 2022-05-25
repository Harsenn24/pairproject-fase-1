const {User, Clothe, Profile, Transaction} = require("../models/index")
const bycrpt = require("bcryptjs")
const {changeFormat} = require("../helps/help")

class clientController {
    static login(req,res) {
        res.render("loginClient.ejs")
    }

    static loginPost(req,res){
        let {username, password} = req.body
        User.findOne({
            where : {username}
        })
        .then(user=>{
            if (user && user.role === "client") {
                let truePassword = bycrpt.compareSync(password, user.password)
                if(truePassword) {
                    return res.redirect(`/client/login/${user.id}`)
                } else {
                    const error = "Invalid Username or Password"
                    return res.send(error)
                }
            }
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static showClothes(req,res) {
        let userId = +req.params.userId
        let clotheDel = req.query.name
        let result1
        
        User.findAll({
            where : {
                id : userId
            },
            include : Profile
        })
        .then(result=>{
            result1 = result
            // res.send(result1)
            return Transaction.findAll({
                where : {
                    UserId : result1[0].id, 
                },
                include : Clothe,
                order : [['id', 'ASC']]
            })
        })
        .then(result2=>{
            let totalBill = 0
            result2.forEach(x=>{
                totalBill += x.Clothe.price
            })

            let totalHarga = changeFormat(totalBill)
            res.render("clientClothe.ejs", {result1, result2, userId, totalHarga, clotheDel})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static addProfil(req,res) {
        let userId = req.params.userId
        res.render("addProfilClient.ejs", {userId})
    }

    static addProfilPost(req,res) {
        let UserId = +req.params.userId
        let inputForm = req.body
        let {fullName , gender} = inputForm
        let newProfil = {fullName, gender, UserId}
        Profile.create(newProfil)
        .then(result=>{
            res.redirect(`/client/login/${UserId}`)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static editProfil(req, res){
        let userId = +req.params.userId
        Profile.findAll({
            where : {
                UserId : userId
            }
        })
        .then(result => {
            res.render("editProfilClient.ejs", {result})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static editProfilPost(req, res) {
        let userId = req.params.userId
        let editForm = req.body
        let {fullName, gender} = editForm
        let updateProfile = {fullName, gender}
        Profile.update(updateProfile, {
            where : {
                UserId : userId
            }
        })
        .then(result => {
            res.redirect(`/client/login/${userId}`)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static buyClothe(req, res) {
        let userId = req.params.userId
        let ClotheName = req.query.name
        let failedBuy = req.query.failed

        Clothe.findAll({
            order : [['id', 'ASC']]
        })
        .then(result => {
            res.render("buyClothe.ejs", {result, userId, ClotheName, failedBuy})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static addClothe(req,res){
        let userId = +req.params.userId
        let ClotheId = +req.params.clotheId
        let currentStock
        let clothName
        Clothe.findAll({
            where : {
                id : ClotheId
            }
        })
        .then(result1 => {
            currentStock = result1[0].stock 
            clothName = result1[0].name
            if(currentStock <= 0){
                res.redirect(`/client/login/${userId}/buyClothe?failed=${clothName}`)
            } else {
                return Clothe.decrement('stock',{
                    where : {
                        id : ClotheId
                    }
                })
            }          
        })
        .then(result2 => {
            return Profile.findAll({
                where : {
                    UserId : userId
                }
            })
        })
        .then(result3 => {
            let UserId = result3[0].UserId
            let addTrx = {UserId, ClotheId}
            return Transaction.create(addTrx)
        })
        .then(() => {
            res.redirect(`/client/login/${userId}/buyClothe?name=${clothName}`)
        })
        .catch(err=>{
            console.log(err)

        })
    }

    static deleteClothe(req,res) {
        let userId = req.params.userId
        let trxId = req.params.trxId
        let clotheDel

        Transaction.findAll({
            where : {
                id : trxId
            },
            include : Clothe
        })
        .then(result1 =>{
            clotheDel = result1[0].Clothe.name
            let idClothe = result1[0].Clothe.id
            return Clothe.increment('stock', {
                where : {
                    id : idClothe
                }
            })
        })
        .then(result2 => {
            return Transaction.destroy({
                where : {
                    id : trxId
                }
            })
        })
        .then(result3 =>{
            res.redirect(`/client/login/${userId}?name=${clotheDel}`)
        })
        .catch(err=>{
            console.log(err)
        })


    }
}

module.exports = clientController
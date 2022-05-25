const {User, Clothe, Profile} = require("../models/index")
const bycrpt = require("bcryptjs")


class adminController{
    static login(req,res){
        res.render("loginAdmin.ejs")
    }

    static loginPost(req,res){
        let {username, password} = req.body
        User.findOne({
            where : {username}
        })
        .then(user=>{
            // console.log(user)
            if (user && user.role === "admin") {
                let truePassword = bycrpt.compareSync(password, user.password)
                if(truePassword) {
                    req.session.userId = user.id
                    res.redirect(`/admin/login/${user.id}`)
                } else {
                    const error = "Invalid Username or Password"
                    res.send(error)
                }
            }
        })
        .catch(err=>{
            res.send("ANDA BUKAN ADMIN")
        })
    }

    static showClothes(req,res) {
        let name = req.query.name
        let userId = +req.params.userId
        let result1
        
        Profile.findAll({
            where : {
                UserId : userId
            },
            include : User
        })
        .then(result=>{
            result1 = result
            return Clothe.findAll({
                order : [['id', 'ASC']],
                where : {
                    name : Clothe.searchByName(name)
                }
            })
        })
        .then(result2=>{
            res.render("showClothes.ejs", {result1, result2, userId})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static addProfil(req,res) {
        let userId = req.params.userId
        res.render("addProfil.ejs", {userId})
    }

    static addProfilPost(req,res) {
        let UserId = +req.params.userId
        let inputForm = req.body
        let {fullName , gender} = inputForm
        let newProfil = {fullName, gender, UserId}
        Profile.create(newProfil)
        .then(result=>{
            res.redirect(`/admin/login/${UserId}`)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static editProfil(req, res){
        let profileId = +req.params.userId
        // console.log(profileId)
        Profile.findAll({
            where : {
                UserId : profileId
            }
        })
        .then(result => {
            res.render("editProfil.ejs", {result})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static editProfilPost(req, res) {
        let profileId = req.params.userId
        let editForm = req.body
        let {fullName, gender} = editForm
        let updateProfile = {fullName, gender}
        // console.log(editForm)
        Profile.update(updateProfile, {
            where : {
                UserId : profileId
            }
        })
        .then(result => {
            res.redirect(`/admin/login/${profileId}`)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static allUser(req, res) {
        let userId = req.params.userId
        User.findAll()
        .then(result => {
            // res.send(result)
            res.render("allUser.ejs", {result, userId})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static addClothe(req, res) {
        let errors = {}
        let userId = req.params.userId
        res.render("addClothe.ejs", {userId, errors})
    }

    static addClothePost(req, res) {
        let userId = req.params.userId
        let {imageUrl, name, type, stock, price, status} = req.body
        let newClothe = {imageUrl, name, type, stock, price, status}

        Clothe.create(newClothe)
        .then(result => {
            res.redirect(`/admin/login/${userId}`)
        })
        .catch(err=>{
            const errors = {}
            err.errors.forEach(x=>{
                if(errors[x.path]) {
                    errors[x.path].push(x.message)
                } else {
                    errors[x.path] = x.message
                }
            })
            res.render("addClothe.ejs", {userId, errors})
        })

    }

    static editClothe(req,res) {
        let idClothe = req.params.clotheId
        let userId = req.params.userId

        Clothe.findByPk(idClothe)
        .then(result => {
            res.render("editClothe.ejs", {result, userId})
        })
        .catch(err=>{
            console.log(err)
        })

    }

    static editClothePost(req,res){
        let {imageUrl, name, type, stock, price, status} = req.body
        let idClothe = req.params.clotheId
        let userId = req.params.userId

        let editForm = {imageUrl, name, type, stock, price, status}

        Clothe.update(editForm, {
            where : {
                id : idClothe
            }
        })
        .then(result => {
            res.redirect(`/admin/login/${userId}`)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static deleteClothe(req,res) {
        let idClothe = req.params.clotheId
        let userId = req.params.userId
        Clothe.destroy({
            where : {
                id : idClothe
            }
        })
        .then(result => {
            res.redirect(`/admin/login/${userId}`)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static stockPlus(req,res) {
        let idClothe = req.params.clotheId
        let userId = req.params.userId
        
        Clothe.findAll({
            where : {
                id : idClothe
            }
        })
        .then(result => {
            return Clothe.increment('stock',{
                where : {
                    id : idClothe
                }
            })
        })
        .then(result => {
            res.redirect(`/admin/login/${userId}`)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static stockMinus(req,res) {
        let idClothe = req.params.clotheId
        let userId = req.params.userId
        let currentStock
        
        Clothe.findAll({
            where : {
                id : idClothe
            }
        })
        .then(result => {
            if(result[0].stock <= 0) {
                return res.redirect(`/admin/login/${userId}`)
            } else {
                return Clothe.decrement('stock', {
                    where :{
                        id : idClothe
                    }
                })
            }
        })
        .then(result => {
            if(currentStock !== 0) {
                return res.redirect(`/admin/login/${userId}`)
            } else {
                return Clothe.update(
                    {status : "OutOfStock"}, {
                        where : {
                            id : idClothe
                        }
                    }
                )
            }
        })
        .then(result => {
            return res.redirect(`/admin/login/${userId}`)
        })
        .catch(err=>{
            console.log(err)
        })
    }
}

module.exports = adminController
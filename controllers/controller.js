const {User} = require("../models/index")
const nodemailer = require('nodemailer')

class Controller{
    static home(req,res){
        res.render(`home.ejs`)
    }

    static register(req,res){
        let errors = {}
        res.render("register.ejs", {errors})
    }

    static registerPost(req,res){
        let {username, password, email, role} = req.body
        let newAcc = {username, password, email, role}

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'randychan35@gmail.com',
                pass: 'ehvdovnblfkpenzy'
            }
        });

        var mailOptions = {
            from: 'randychan35@gmail.com',
            to: email,
            subject: 'Clothe OKE Pair Project',
            text: `HAI ${username}, Terima Kasih telah mendaftar.`
        };


        User.create(newAcc,{
            returning : true
        })
        .then(()=>{
            if(role === "client") {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.redirect(`/client/login`)
                    }
                })
            } if (role === "admin") {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.redirect(`/admin/login`)
                    }
                })
            }
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
            res.render("register.ejs", {errors})
        })
    }
}

module.exports = Controller
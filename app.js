const express = require("express")
const app = express()
const port = process.env.PORT || 3000 
const router = require("./routers/index.js")
const session = require('express-session')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'kebanggaan kita',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true,
  }
}))

app.use('/' , router)

app.listen(port, () => {
  console.log(`This program is running`, port);
}) 
const express = require('express')
const app = express()
const cors = require("cors")
// const db = require("./models")
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.static(__dirname))

//router user
const user = require('./routes/user')
app.use("/user", user)

// router meja
const meja = require('./routes/meja')
app.use("/meja/", meja)

//router menu
const menu = require('./routes/menu')
app.use("/menu", menu)

//router transaksi
const transaksi = require('./routes/transaksi')
app.use("/transaksi", transaksi)

//router transaksi
// const transaksi = require('./routes/transaksi')
// app.use("/transaksi", transaksi)


app.listen(port, () => console.log(`App running ${port}`))

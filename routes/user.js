const express = require("express")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeSequelize"
const md5 = require("md5")
const router = express()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended : true}))

const model = require('../models/index').user
const modelUser = model

router.get("/", (req, res) => {
    modelUser.findAll()
        .then(result => {
            res.json({
                user : result
            })
        })
        .catch(error => {
             res.json({
                message: error.message
            })
        })
})
router.get("/:id_user", async (req, res) => {
    let param = {
        id_user : req.params.id_user
    }
    let result = await modelUser.findOne({
        where: param,
    })
    res.json({
        user: result
    })
})
router.post("/tambah", (req, res) => {
    let user = {
        nama_user: req.body.nama_user,
        role: req.body.role,
        username: req.body.username,
        password: md5(req.body.password)
    }
    
    modelUser.create(user)
        .then(result => {
            return res.json({
                message: "success add data user",
                user : result
            })
        })
        .catch(err => {
            return res.json({
                message: err.message
            })
        })
})
router.put("/:id_user", (req, res) => {
    let id_user = req.params.id_user
    let user = {
        nama_user: req.body.nama_user,
        role : req.body.role,
        username: req.body.username,
        password: md5(req.body.password)
    }

    modelUser.update(user, { where: {id_user: id_user} })
    .then(result => {
        return res.json({
            message: "success update data",
            user 
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})
router.delete("/:id_user", (req, res) => {
    let id_user = req.params.id_user
    modelUser.destroy({ where: { id_user: id_user} })
        .then(result => {
            return res.json({
                message: "data deleted"
            })
        })
        .catch(err => {
            return res.json({
                message: err.message
            })
        })
})
router.post("/login", async (req, res) => {
    let user = {
        username: req.body.username,
        password: md5(req.body.password)
    }
    //validasi cek data di tabel user
    let result = await modelUser.findOne({ where: user })
    if (result) {
        //data ditemukan

        //payload adalah informasi yang didapat dari tabel yang akan di enkripsi
        let payload = JSON.stringify(result) //konversi dari objek ke json

        //generate token
        let token = jwt.sign(payload, SECRET_KEY)
        return res.json({
            logged: true,
            user: result,
            token: token
        })
    } else {
        //data tidak ditemukan
        return res.json({
            logged: false,
            message: "data tidak ditemukan"
        })
    }
})
module.exports = router
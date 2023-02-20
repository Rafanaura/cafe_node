const express = require ("express")
const router = express()
router.use(express.json())
const model = require("../models/index").meja
const modelMeja = model

router.get("/", (req, res) => {
    modelMeja.findAll()
        .then(result => {
            res.json({
                meja : result
            })
        })
        .catch(err => {
            res.json({
                message : err.message
            })
        })
})

router.post("/tambah-meja", (req, res) => {
    let meja = {
        nomor_meja : req.body.nomor_meja,
        status : req.body.status
    }
    modelMeja.create(meja)
       .then(result => {
        return res.json({
            message : "success add meja",
            meja
        })
       })
       .catch(err => {
            return res.json({
                message : err.message
            })
       })
})

router.put("/:id_meja", (req, res) => {
    let id_meja = req.params.id_meja
    let meja = {
        nomor_meja : req.body.nomor_meja,
        status : req.body.status
    }
    modelMeja.update(meja, {where : {id_meja : id_meja}})
    .then(result => {
        return res.json({
            message : "success edit meja",
            meja
        })
    })
    .catch(err => {
        return res.json({
            message : err.message
        })
    })
})

router.delete("/:id_meja", (req, res) => {
    let id_meja = req.params.id_meja
    modelMeja.destroy({ where: { id_meja: id_meja} })
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

module.exports = router
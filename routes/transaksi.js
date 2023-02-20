const express = require("express");
const moment = require("moment");
const router = express();
router.use(express.json());
const modelT = require('../models/index').transaksi
const modelTransaksi = modelT
const modelDT = require('../models/index').detail_transaksi
const modelDetailTransaksi = modelDT

router.get("/", async (req, res) => {
  try {
    let result = await modelTransaksi.findAll({
      include: [
        "user",
        {
          model: modelDetailTransaksi,
          as: "detail_transaksi",
          include: ["menu"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json({
      message: "show all data transaksi",
      transaksi : result
    });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
});

router.get ("/:id_transaksi", async (req,res) => {
  let param = { id_transaksi: req.params.id_transaksi}
  let result = await modelTransaksi.findOne({
      where: param,
      include: [
          "user",
          {
            model: modelDetailTransaksi,
            as: "detail_transaksi",
            include: ["menu"]
          },
      ],
  })
  let totalAkhir = await modelTransaksi.sum("totalAkhir", {
    where : param
})
  res.json({
    transaksi : result,
    totalAkhir : totalAkhir
})
})

router.get ("/:id_user", async (req,res) => {
  let param = { id_transaksi: req.params.id_transaksi}
  let result = await modelTransaksi.findOne({
      where: param,
      include: [
          "user",
          {
            model: modelDetailTransaksi,
            as: "detail_transaksi",
            include: ["meja"]
          },
      ],
  })
  let totalAkhir = await modelTransaksi.sum("totalAkhir", {
    where : param
})
  res.json({
    transaksi : result,
    totalAkhir : totalAkhir
})
})
router.get("/favorit", async (req, res) => {

  // select * id_menu, sum(qty) from 'detail_transaksi' group_by id_menu
})

router.get("/tanggal", async (req, res) => {
  let tgl = new Date()
  let now = moment(tgl).format("YYYY-MM-DD")
  let result = await modelTransaksi.findOne({
    where : now,
    include : [
      
    ]
  })
})
router.post("/tambah-transaksi", (req, res) => {
  let tgl = new Date();
  let now = moment(tgl).format("YYYY-MM-DD");
  let transaksi = {
    tgl_transaksi: req.body.tgl_transaksi,
    id_user: req.body.id_user,
    id_meja : req.body.id_meja,
    nama_pelanggan : req.body.nama_pelanggan,
    status: req.body.status,
    totalAkhir: req.body.totalAkhir,
  };
  modelTransaksi.create(transaksi)
    .then(result => {
      let lastID = result.id_transaksi;
    //   console.log(lastID);
      detail = req.body.detail;
      detail.forEach(element => {
        element.id_transaksi = lastID;
        console.log(element.id_transaksi)
      });
      console.log(detail)
      modelDetailTransaksi
        .bulkCreate(detail, {individualHooks:true})
        .then(result => {
          res.json({
            message: "Data has been inserted",
            detail: result
          });
        })
        .catch(error => {
          res.json({
            message: error.message,
          });
        });
    })
    .catch(error => {
      res.json({
        message: error.message,
      });
    });
});

router.put("/:id_transaksi", (req, res) => {
  let current = new Date();
  let now = moment(current).format("YYYY-MM-DD");
  let param = {
    id_transaksi: req.params.id_transaksi
  }
  let transaksi = {
    status: req.body.status,
  };
  if (transaksi.status === "lunas") {
    (transaksi.tanggal_bayar = now);
  }
  modelTransaksi
    .update(transaksi, { where: param })
    .then((result) => {
      return res.json({
        message: "data updated",
        transaksi : result
      });
    })
    .catch((err) => {
      return res.json({
        message: err.message,
      });
    });
});

router.delete("/:id_transaksi", (req, res) => {
  let id_transaksi = req.params.id_transaksi;

  //delete detail
  modelDetailTransaksi.destroy({where : {id_transaksi : id_transaksi}})
  .then((result) => {
    modelTransaksi
    .destroy({ where: { id_transaksi: id_transaksi } })
    .then((result) => {
      return res.json({
        message : "data transaksi deleted"
      })
    })
    .catch((err) => {
      return res.json({
        message: err.message,
      });
    });
  })
  .catch((err) => {
    return res.json({
      message: err.message,
    });
  });
});

module.exports = router;
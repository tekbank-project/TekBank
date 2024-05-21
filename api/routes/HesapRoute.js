const express = require('express');
const router = express.Router();

const HesapController = require('../controllers/HesapController');
const auth = require("../middleware/isAuth");

router.post('/tumhesaplar', auth, HesapController.TumHesaplar);
router.post('/yenihesap', auth, HesapController.YeniHesap);
router.patch('/guncelle', auth, HesapController.HesapGuncelle);
router.delete('/hesapsil', auth, HesapController.HesapSil);

module.exports = router;
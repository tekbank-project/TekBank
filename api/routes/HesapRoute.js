const express = require('express');
const router = express.Router();

const HesapController = require('../controllers/HesapController');
const auth = require("../middleware/isAuth");

router.post('/tumhesaplar', HesapController.TumHesaplar);
router.post('/hesapkontrol', HesapController.HesapKontrol)
router.post('/yenihesap', HesapController.YeniHesap);
router.patch('/guncelle', HesapController.HesapGuncelle);
router.delete('/hesapsil', HesapController.HesapSil);

module.exports = router;
const express = require('express');
const router = express.Router();

const KullaniciController = require('../controllers/KullaniciController');
const auth = require("../middleware/isAuth");

router.post('/yenikayit', KullaniciController.YeniKayit);
router.post('/giris', KullaniciController.Giris);

router.post('/cikis', KullaniciController.Cikis);
router.patch('/guncelle', KullaniciController.KullaniciGuncelle);
router.delete('/kayitsil', KullaniciController.KullaniciSil);

module.exports = router;
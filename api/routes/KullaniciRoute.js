const express = require('express');
const router = express.Router();

const KullaniciController = require('../controllers/KullaniciController');
const auth = require("../middleware/isAuth");

router.post('/yenikayit', KullaniciController.YeniKayit);
router.post('/giris', KullaniciController.Giris);
router.patch('/guncelle', auth, KullaniciController.KullaniciGuncelle);
router.delete('/kayitsil', auth, KullaniciController.KullaniciSil);

module.exports = router;
const express = require('express');
const router = express.Router();

const SubeController = require('../controllers/SubeController');
const auth = require("../middleware/isAuth");

router.post('/tumsubeler', auth, SubeController.TumSubeler);
router.post('/yenisube', auth, SubeController.YeniSube);
router.patch('/guncelle', auth, SubeController.HesapGuncelle);
router.delete('/hesapsil', auth, SubeController.HesapSil);

module.exports = router;
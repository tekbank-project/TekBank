const express = require('express');
const router = express.Router();

const SubeController = require('../controllers/SubeController');
const auth = require("../middleware/isAuth");

router.post('/tumsubeler', SubeController.TumSubeler);
router.post('/yenisube', SubeController.YeniSube);
router.patch('/guncelle', SubeController.SubeGuncelle);
router.delete('/subesil', SubeController.SubeSil);

module.exports = router;
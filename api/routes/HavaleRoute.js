const express = require('express');
const router = express.Router();

const HavaleController = require('../controllers/HavaleController');
const auth = require("../middleware/isAuth");

router.post('/gecmis', HavaleController.GecmisHavaleler);
router.post('/yenihavale', HavaleController.YeniHavale);

module.exports = router;
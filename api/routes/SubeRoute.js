const express = require('express');
const router = express.Router();
const SubeController = require('../controllers/SubeController');

// Şube oluşturma
router.post('/olustur', SubeController.SubeOlustur);

module.exports = router;

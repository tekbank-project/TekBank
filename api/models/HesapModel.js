const mongoose = require('mongoose');

const HesapModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    KullaniciId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KullaniciModel',
        required: true
    },
    HesapNo: { type: Number, required: true },
    Bakiye: { type: Number, required: true },
    Aktiflik: { type: Boolean, required: true }
});

module.exports = mongoose.model('HesapModel', HesapModel);
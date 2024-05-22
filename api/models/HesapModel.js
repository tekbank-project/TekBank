const mongoose = require('mongoose');

const HesapModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    KullaniciId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KullaniciModel'
    },
    HesapAdi: { type: String },
    HesapNo: { type: Number },
    Bakiye: { type: Number },
    Aktiflik: { type: Boolean }
});

module.exports = mongoose.model('HesapModel', HesapModel);
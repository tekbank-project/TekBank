const mongoose = require('mongoose');

const KullaniciModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    KullaniciAd: { type: String },
    KullaniciSoyad: { type: String },
    KullaniciTCKN: { type: Number },
    KullaniciSifre: { type: String },
    KullaniciEmail: { type: String },
    KullaniciAdres: { type: String },
    KullaniciTelefon: { type: String },
    KullaniciSubesi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubeModel'
    },
    KullaniciYetkileri: { type: String },
    YetkiToken: { type: String }
});

module.exports = mongoose.model('KullaniciModel', KullaniciModel);
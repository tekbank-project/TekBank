const mongoose = require('mongoose');

const KullaniciModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    KullaniciAd: { type: String, required: true },
    KullaniciSoyad: { type: String, required: true },
    KullaniciTCKN: { type: Number, required: true },
    KullaniciSifre: { type: String, required: true },
    KullaniciEmail: { type: String, required: true },
    KullaniciAdres: { type: String, required: true },
    KullaniciTelefon: { type: String, required: true },
    KullaniciSubesi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubeModel',
        required: true
    },
    KullaniciYetkileri: { type: String, required: true }
});

module.exports = mongoose.model('KullaniciModel', KullaniciModel);
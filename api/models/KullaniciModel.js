const mongoose = require('mongoose');

const KullaniciSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    KullaniciAd: { type: String, required: true },
    KullaniciSoyad: { type: String, required: true },
    KullaniciTCKN: { type: Number, required: true, unique: true },
    KullaniciSifre: { type: String, required: true },
    KullaniciEmail: { type: String, required: true, unique: true },
    KullaniciAdres: { type: String, required: true },
    KullaniciTelefon: { type: String, required: true },
    KullaniciSubesi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubeModel',
        required: true
    },
    KullaniciYetkileri: { type: String, required: true },
    YetkiToken: { type: String }
});

module.exports = mongoose.model('KullaniciModel', KullaniciSchema);

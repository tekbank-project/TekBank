const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');

const KullaniciModel = require('../models/KullaniciModel');
const { YetkiKontrol } = require('../middleware/YetkiKontrol');

exports.YeniKayit = async (req, res, next) => {
    const salt = await bcrpyt.genSalt();
    KullaniciModel.find({ KullaniciEmail: req.body.KullaniciEmail }).exec().then(results => {
        if (results.length >= 1) {
            console.log(results);
            return res.status(401).json({ message: 'Bu e-posta ile kayitli bir kullanıcı bulunmaktadir.' });
        }
        bcrpyt.hash(req.body.KullaniciSifre, salt, (err, hash) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Internal server error' });
            } else {
                const newKullanici = new KullaniciModel({
                    _id: new mongoose.Types.ObjectId(),
                    KullaniciAd: req.body.KullaniciAd,
                    KullaniciSoyad: req.body.KullaniciSoyad,
                    KullaniciTCKN: req.body.KullaniciTCKN,
                    KullaniciSifre: hash,
                    KullaniciEmail: req.body.KullaniciEmail,
                    KullaniciAdres: req.body.KullaniciAdres,
                    KullaniciTelefon: req.body.KullaniciTelefon,
                    KullaniciSubesi: req.body.KullaniciSubesi,
                    KullaniciYetkileri: "Musteri"
                })
                newKullanici.save().then(result => {
                    return res.status(201).json({ message: 'Yeni kullanici olusturuldu.' });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({ message: 'Internal server error' });
                });
            };
        });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    });
};

exports.Giris = async (req, res, next) => {
    KullaniciModel.find({ KullaniciEmail: req.body.KullaniciEmail }).exec().then(user => {
        if (user.length == 0) { return res.status(401).json({ message: 'Kullanici bulunamadi.' }); };
        bcrpyt.compare(req.body.KullaniciSifre, user[0].KullaniciSifre, (err, response) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            };
            if (response) {
                const jwttoken = jwt.sign(
                    { email: user[0].KullaniciEmail },
                    process.env.JWT_TOKEN_SECRET,
                    { expiresIn: "4h" }
                );
                const NewYetkiToken = require('crypto').randomBytes(64).toString('hex');
                KullaniciModel.findOneAndUpdate(
                    { KullaniciEmail: req.body.KullaniciEmail },
                    { YetkiToken: NewYetkiToken }
                ).exec().catch(err => {
                    console.log(err);
                    return res.status(500).json({ message: 'Internal server error' });
                })
                return res.status(200).json({
                    message: 'Giris basarili',
                    token: jwttoken,
                    YetkiToken: NewYetkiToken
                });
            };
        });
    }).catch(err => {
        console.log(err);
        return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' });
    });
};

exports.Cikis = async (req, res, next) => {
    KullaniciModel.findOneAndUpdate(
        { KullaniciEmail: req.body.KullaniciEmail },
        { YetkiToken: 0 }
    ).exec().then(result => {
        console.log(result);
        return res.status(200).json({ message: "Basariyla cikis yapildi." });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    });
};

exports.KullaniciGuncelle = async (req, res, next) => {
    /*const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    */
    if (req.body.KullaniciEmail) { return res.status(409).json({ message: 'Kullanici e-postasi guncellenemez.' }); }
    if (req.body.KullaniciSifre) {
        const salt = await bcrpyt.genSalt();
        bcrpyt.hash(req.body.KullaniciSifre, salt, (err, hash) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Internal server error' });
            } else {
                const update = {};
                for (const key of Object.keys(req.body)) {
                    if (req.body[key]) { update[key] = req.body[key]; };
                };
                KullaniciModel.findOneAndUpdate(
                    { KullaniciEmail: req.body.KullaniciEmail },
                    { $set: update }
                ).exec().then(result => {
                    console.log(result);
                    return res.status(200).json({ message: 'Kullanici guncellendi.' });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({ message: 'Internal server error' });
                });
            };
        });
    };
    const update = {};
    for (const key of Object.keys(req.body)) {
        if (req.body[key]) { update[key] = req.body[key]; };
    };
    KullaniciModel.findOneAndUpdate(
        { KullaniciEmail: req.body.KullaniciEmail },
        { $set: update }
    ).exec().then(result => {
        console.log(result);
        res.status(200).json({ message: 'Kullanici guncellendi.' });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    });
};

exports.KullaniciSil = async (req, res, next) => {
    /*const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    if (YetkiKontrol(req.body.KullaniciEmail, "KullaniciSil") === false) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    */
    KullaniciModel.find({ KullaniciEmail: req.body.KullaniciEmail }).exec().then(results => {
        if (results.length == 0) { return res.status(500).json({ message: 'Internal server error' }); };
        bcrpyt.compare(req.body.KullaniciSifre, results[0].KullaniciSifre, (err, result) => {
            if (err) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
            if (result) {
                KullaniciModel.findOneAndDelete({ KullaniciEmail: req.body.KullaniciEmail }).exec().then(result => {
                    return res.status(200).json({ message: 'Kullanici basariyle silindi.' })
                }).catch(err => {
                    console.log(err)
                    return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' });
                });
            };
        });
    }).catch(err => {
        console.log(err);
        return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' });
    });
};
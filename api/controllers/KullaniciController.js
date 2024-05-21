const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');

const KullaniciModel = require('../models/KullaniciModel');
const { YetkiKontrol } = require('../middleware/YetkiKontrol');

exports.YeniKayit = async (req, res, next) => {
    KullaniciModel.find({ KullaniciEmail: req.body.email }).exec().then(results => {
        if (results.length >= 1) {
            console.log(results);
            return res.status(401).json({ message: 'Bu e-posta ile kayitli bir kullanıcı bulunmaktadir.' });
        }
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    });
    const salt = await bcrpyt.genSalt();
    bcrpyt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        } else {
            const newKullanici = new KullaniciModel({
                _id: new mongoose.Types.ObjectId(),
                KullaniciAd: req.body.name,
                KullaniciSoyad: req.body.surname,
                KullaniciTCKN: req.body.tckn,
                KullaniciSifre: hash,
                KullaniciEmail: req.body.email,
                KullaniciAdres: req.body.address,
                KullaniciTelefon: req.body.tel,
                KullaniciSubesi: req.body.sube,
                KullaniciYetkileri: "Musteri"
            })
            newKullanici.save().then(result => {
                res.status(201).json({ message: 'Yeni kullanici olusturuldu.' });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ message: 'Internal server error' });
            });
        };
    });
};

exports.Giris = async (req, res, next) => {
    KullaniciModel.find({ KullaniciEmail: req.body.email }).exec().then(user => {
        if (user.length == 0) { return res.status(401).json({ message: 'Kullanici bulunamadi.' }); };
        bcrpyt.compare(req.body.password, user[0].password, (err, response) => {
            if (err) {
                return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' });
            };
            if (response) {
                const jwttoken = jwt.sign(
                    {email: user[0].email },
                    process.env.JWT_TOKEN_SECRET,
                    { expiresIn: "4h" }
                );
                const NewYetkiToken = require('crypto').randomBytes(64).toString('hex');
                KullaniciModel.findOneAndUpdate(
                    { KullaniciEmail: req.body.email },
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
            res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' });
        });
    }).catch(err => {
        console.log(err);
        return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' });
    });
};

exports.Giris = async (req, res, next) => {
    const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };

    KullaniciModel.findOneAndUpdate(
        { KullaniciEmail: req.body.yetkitoken },
        { YetkiToken: 0 }
    ).exec().then(result => {
        console.log(result);
        return res.status(200).json({ message: "Basariyla cikis yapildi." });
    }).catch(err => {
        console.log(err);
        return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' });
    });
};

exports.KullaniciGuncelle = async (req, res, next) => {
    const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };

    if (req.body.email) { return res.status(409).json({ message: 'Kullanici e-postasi guncellenemez.' }); }
    if (req.body.password) {
        bcrpyt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Internal server error' });
            } else {
                const update = {};
                for (const key of Object.keys(req.body)) {
                    if (req.body[key]) { update[key] = req.body[key]; };
                };
                KullaniciModel.findOneAndUpdate(
                    { email: req.body.email },
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
        { KullaniciEmail: req.body.email },
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
    const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    if (YetkiKontrol(req.body.email, "KullaniciSil") === false) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };

    KullaniciModel.find({ KullaniciEmail: req.body.email }).exec().then(results => {
        if (results.length == 0) { return res.status(500).json({ message: 'Internal server error' }); };
        bcrpyt.compare(req.body.password, results[0].password, (err, result) => {
            if (err) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
            if (result) {
                KullaniciModel.findOneAndDelete({ KullaniciEmail: req.body.email }).exec().then(result => {
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
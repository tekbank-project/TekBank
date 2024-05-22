const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const KullaniciModel = require('../models/KullaniciModel');

exports.YeniKayit = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt();
        const existingUser = await KullaniciModel.findOne({ KullaniciEmail: req.body.KullaniciEmail });
        
        if (existingUser) {
            return res.status(401).json({ message: 'Bu e-posta ile kayitli bir kullanıcı bulunmaktadir.' });
        }
        
        const hash = await bcrypt.hash(req.body.KullaniciSifre, salt);
        
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
            KullaniciYetkileri: req.body.KullaniciYetkileri || "Musteri",
            YetkiToken: ''
        });
        
        const result = await newKullanici.save();
        res.status(201).json({ message: 'Yeni kullanici olusturuldu.', user: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.Giris = async (req, res, next) => {
    try {
        const user = await KullaniciModel.findOne({ KullaniciEmail: req.body.KullaniciEmail });
        
        if (!user) {
            return res.status(401).json({ message: 'Kullanici bulunamadi.' });
        }

        const isMatch = await bcrypt.compare(req.body.KullaniciSifre, user.KullaniciSifre);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Yetkisiz' });
        }

        const jwttoken = jwt.sign(
            { email: user.KullaniciEmail },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: "4h" }
        );
        
        const NewYetkiToken = require('crypto').randomBytes(64).toString('hex');
        
        user.YetkiToken = NewYetkiToken;
        await user.save();

        res.status(200).json({
            message: 'Giris basarili',
            token: jwttoken,
            YetkiToken: NewYetkiToken
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.Cikis = async (req, res, next) => {
    try {
        const user = await KullaniciModel.findOneAndUpdate(
            { KullaniciEmail: req.body.KullaniciEmail },
            { YetkiToken: '' }
        );

        if (!user) {
            return res.status(401).json({ message: 'Kullanici bulunamadi.' });
        }

        res.status(200).json({ message: 'Basariyla cikis yapildi.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.KullaniciGuncelle = async (req, res, next) => {
    if (req.body.KullaniciEmail) {
        return res.status(409).json({ message: 'Kullanici e-postasi guncellenemez.' });
    }

    try {
        const update = {};
        for (const key in req.body) {
            if (req.body[key]) {
                update[key] = req.body[key];
            }
        }

        if (req.body.KullaniciSifre) {
            const salt = await bcrypt.genSalt();
            update.KullaniciSifre = await bcrypt.hash(req.body.KullaniciSifre, salt);
        }

        const user = await KullaniciModel.findOneAndUpdate(
            { KullaniciEmail: req.body.KullaniciEmail },
            { $set: update },
            { new: true }
        );

        if (!user) {
            return res.status(401).json({ message: 'Kullanici bulunamadi.' });
        }

        res.status(200).json({ message: 'Kullanici guncellendi.', user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.KullaniciSil = async (req, res, next) => {
    try {
        const user = await KullaniciModel.findOne({ KullaniciEmail: req.body.KullaniciEmail });
        
        if (!user) {
            return res.status(401).json({ message: 'Kullanici bulunamadi.' });
        }

        const isMatch = await bcrypt.compare(req.body.KullaniciSifre, user.KullaniciSifre);

        if (!isMatch) {
            return res.status(401).json({ message: 'Yetkisiz' });
        }

        await KullaniciModel.findOneAndDelete({ KullaniciEmail: req.body.KullaniciEmail });

        res.status(200).json({ message: 'Kullanici basariyle silindi.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

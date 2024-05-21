const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const KullaniciModel = require('../models/KullaniciModel');

exports.YeniKayit = async (req, res, next) => {
    try {
        const existingUser = await KullaniciModel.findOne({ KullaniciEmail: req.body.email });
        if (existingUser) {
            return res.status(401).json({ message: 'Bu e-posta ile kayıtlı bir kullanıcı bulunmaktadır.' });
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(req.body.password, salt);

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
            KullaniciYetkileri: req.body.yetkiler,
            YetkiToken: jwt.sign(
                { email: req.body.email },
                process.env.JWT_TOKEN_SECRET,
                { expiresIn: "4h" }
            )
        });

        await newKullanici.save();
        return res.status(201).json({ message: 'Yeni kullanıcı oluşturuldu.', user: newKullanici });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


exports.Giris = async (req, res, next) => {
    try {
        const user = await KullaniciModel.findOne({ KullaniciEmail: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
        }

        const match = await bcrypt.compare(req.body.password, user.KullaniciSifre);
        if (!match) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.KullaniciEmail },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '4h' }
        );

        const newYetkiToken = require('crypto').randomBytes(64).toString('hex');
        user.YetkiToken = newYetkiToken;
        await user.save();

        return res.status(200).json({
            message: 'Giriş başarılı',
            token,
            YetkiToken: newYetkiToken
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.Cikis = async (req, res, next) => {
    try {
        const auth = req.userData;
        if (!auth) {
            return res.status(401).json({ message: 'Bu işlem için yetkiniz yoktur.' });
        }

        const user = await KullaniciModel.findOneAndUpdate(
            { KullaniciEmail: req.body.email },
            { YetkiToken: '' }
        );

        if (!user) {
            return res.status(401).json({ message: 'Bu işlem için yetkiniz yoktur.' });
        }

        return res.status(200).json({ message: 'Başarıyla çıkış yapıldı.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.KullaniciGuncelle = async (req, res, next) => {
    try {
        const auth = req.userData;
        if (!auth) {
            return res.status(401).json({ message: 'Bu işlem için yetkiniz yoktur.' });
        }

        if (req.body.email) {
            return res.status(409).json({ message: 'Kullanıcı e-postası güncellenemez.' });
        }

        const update = {};
        for (const key of Object.keys(req.body)) {
            if (req.body[key]) {
                update[key] = req.body[key];
            }
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            update.KullaniciSifre = await bcrypt.hash(req.body.password, salt);
        }

        const result = await KullaniciModel.findOneAndUpdate(
            { KullaniciEmail: req.body.email },
            { $set: update },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        return res.status(200).json({ message: 'Kullanıcı güncellendi.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.KullaniciSil = async (req, res, next) => {
    try {
        const auth = req.userData;
        if (!auth) {
            return res.status(401).json({ message: 'Bu işlem için yetkiniz yoktur.' });
        }

        const user = await KullaniciModel.findOne({ KullaniciEmail: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        const match = await bcrypt.compare(req.body.password, user.KullaniciSifre);
        if (!match) {
            return res.status(401).json({ message: 'Geçersiz şifre.' });
        }

        await KullaniciModel.findOneAndDelete({ KullaniciEmail: req.body.email });

        return res.status(200).json({ message: 'Kullanıcı başarıyla silindi.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

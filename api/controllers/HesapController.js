const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');

const HesapModel = require('../models/HesapModel');
const KullaniciModel = require('../models/KullaniciModel');

function GenerateHesapNo() {
    return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 100000;
};

exports.TumHesaplar = async (req, res, next) => {
    /*const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    */
    KullaniciModel.find({ KullaniciEmail: req.body.KullaniciEmail }).exec().then(user => {
        HesapModel.find({ KullaniciId: user._id }).exec().then(results => {
            return res.status(200).json(results);
        }).catch(err => {
            console.log(err)
            return res.status(500).json({ message: 'Internal server error' });
        });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    });
};

exports.HesapKontrol = async (req, res, next) => {
    /*const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    */
    HesapModel.find({ HesapNo: req.body.HesapNo }).exec().then(results => {
        console.log(results);
        if (results.length === 0) {
            return res.status(404);
        } else {
            return res.status(200);
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    });
};

exports.YeniHesap = async (req, res, next) => {
    /*const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    */
    KullaniciModel.find({ KullaniciEmail: req.body.KullaniciEmail }).exec().then(results => {
        const newHesap= new HesapModel({
            _id: new mongoose.Types.ObjectId(),
            KullaniciId: results._id,
            HesapNo: GenerateHesapNo(),
            Bakiye: 0,
            Aktiflik: true
        });
        newHesap.save().then(result => {
            return res.status(201).json({ message: 'Yeni hesap olusturuldu.' });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    });
};

exports.HesapGuncelle = async (req, res, next) => {
    /*const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    if (YetkiKontrol(req.body.KullaniciEmail, "HesapGuncelleme") === false) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    */
    KullaniciModel.find({ KullaniciEmail: req.body.KullaniciEmail }).exec().then(user => {
        const update = {};
        for (const key of Object.keys(req.body)) {
            if (req.body[key]) { update[key] = req.body[key]; };
        };
        HesapModel.findOneAndUpdate(
            { KullaniciId: user._id },
            { $set: update }
        ).exec().then(result => {
            res.status(200).json({ message: 'Hesap guncellendi.' });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    });
};

exports.HesapSil = async (req, res, next) => {
    /*const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    */
    HesapModel.findOneAndDelete({ HesapNo: req.body.HesapNo }).exec().then(result => {
        return res.status(200).json({ message: 'Hesap basariyle silindi.' })
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    });
};
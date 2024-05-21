const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');

const HavaleModel = require('../models/HaveleModel');
const KullaniciModel = require('../models/KullaniciModel');
const { YetkiKontrol } = require('./YetkiController');
const HesapModel = require('../models/HesapModel');

exports.GecmisHavaleler = async (req, res, next) => {
    const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    
    KullaniciModel.find({ KullaniciEmail: req.body.email }).exec().then(results => {
        if (results.length >= 1) {
            console.log(results);
            return res.status(401).json({ message: 'Gecmis havale bulunamadi.' });
        };
        HavaleModel.find({ GondericiHesapId: results._id }).exec().then(results => {
            console.log(results);
            return res.status(200).json({ message: results });
        }).catch(err => {
            console.log(err)
            return res.status(500).json({ message: 'Internal server error' });
        });
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    });
};

exports.YeniHavale = async (req, res, next) => {
    const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    
    var GondericiBakiye = 0;
    var AliciBakiye = 0;
    KullaniciModel.find({ KullaniciEmail: req.body.senderemail }).exec().then(sender => {
        if (sender.length == 0) { return res.status(401).json({ message: 'Kullanici bulunamadi.' }); };
        HesapModel.find({ KullaniciId: sender._id }).exec().then(senderHesap => {
            GondericiBakiye = senderHesap.Bakiye;
            HesapModel.find({ HesapNo: req.body.receiverhesapno }).exec().then(receiverHesap => {
                if (sender.length == 0) { return res.status(401).json({ message: 'Alici hesap no bulunamadi.' }); };
                AliciBakiye = receiverHesap.Bakiye;
                if (req.body.islemtutar > GondericiBakiye) {
                    return res.status(401).json({ message: "Yeterli bakiyeniz bulunmamaktadir." });
                };
                var YeniGondericiBakiye = GondericiBakiye - req.body.islemtutar;
                var YeniAliciBakiye = AliciBakiye + req.body.islemtutar;
                HesapModel.findOneAndUpdate(
                    { KullaniciId: sender._id },
                    { Bakiye: YeniGondericiBakiye }
                ).exec().then(results => {
                    console.log(results);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({ message: 'Internal server error' });
                });
                HesapModel.findOneAndUpdate(
                    { HesapNo: receiverHesap.HesapNo },
                    { Bakiye: YeniAliciBakiye }
                ).exec().then(results => {
                    console.log(results);
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({ message: 'Internal server error' });
                });
                const newHavale = new HavaleModel({
                    _id: new mongoose.Types.ObjectId(),
                    GondericiHesapId: senderHesap.HesapNo,
                    AliciHesapId: receiverHesap.HesapNo,
                    IslemTarihi: new Date(),
                    IslemTuru: req.body.islemturu,
                    IslemTutar: req.body.islemtutar,
                })
                newHavale.save().then(result => {
                    return res.status(201).json({ message: 'Havale yapildi.' });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({ message: 'Internal server error' });
                });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ message: 'Internal server error' });
            });;
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    });
};
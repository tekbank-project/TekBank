const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');

const HavaleModel = require('../models/HavaleModel');
const KullaniciModel = require('../models/KullaniciModel');
const { YetkiKontrol } = require('../middleware/YetkiKontrol');
const HesapModel = require('../models/HesapModel');

exports.GecmisHavaleler = async (req, res, next) => {
    try {
        const kullanici = await KullaniciModel.findOne({ KullaniciEmail: req.body.KullaniciEmail });
        if (!kullanici) {
            return res.status(401).json({ message: 'Kullanici bulunamadi.' });
        }

        const havaleler = await HavaleModel.find({ GondericiHesapId: kullanici._id });
        if (havaleler.length === 0) {
            return res.status(401).json({ message: 'Gecmis havale bulunamadi.' });
        }

        return res.status(200).json({ message: havaleler });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.YeniHavale = async (req, res, next) => {
    try {
        const sender = await KullaniciModel.findOne({ KullaniciEmail: req.body.senderemail });
        if (!sender) {
            return res.status(401).json({ message: 'Gonderici kullanici bulunamadi.' });
        }

        const senderHesap = await HesapModel.findOne({ KullaniciId: sender._id });
        if (!senderHesap) {
            return res.status(401).json({ message: 'Gonderici hesap bulunamadi.' });
        }

        const receiverHesap = await HesapModel.findOne({ HesapNo: req.body.receiverhesapno });
        if (!receiverHesap) {
            return res.status(401).json({ message: 'Alici hesap bulunamadi.' });
        }

        if (req.body.islemtutar > senderHesap.Bakiye) {
            return res.status(401).json({ message: "Yeterli bakiyeniz bulunmamaktadir." });
        }

        const yeniGondericiBakiye = senderHesap.Bakiye - req.body.islemtutar;
        const yeniAliciBakiye = receiverHesap.Bakiye + req.body.islemtutar;

        await HesapModel.findOneAndUpdate(
            { KullaniciId: sender._id },
            { Bakiye: yeniGondericiBakiye }
        );

        await HesapModel.findOneAndUpdate(
            { HesapNo: receiverHesap.HesapNo },
            { Bakiye: yeniAliciBakiye }
        );

        const newHavale = new HavaleModel({
            _id: new mongoose.Types.ObjectId(),
            GondericiHesapId: senderHesap.HesapNo,
            AliciHesapId: receiverHesap.HesapNo,
            IslemTarihi: new Date(),
            IslemTuru: req.body.islemturu,
            IslemTutar: req.body.islemtutar,
        });

        await newHavale.save();
        return res.status(201).json({ message: 'Havale yapildi.' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

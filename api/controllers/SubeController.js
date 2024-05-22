const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SubeModel = require('../models/SubeModel');

exports.TumSubeler = async (req, res, next) => {
    SubeModel.find({}).exec().then(results => {
        return res.status(200).json(results);
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    });
};

exports.YeniSube = async (req, res, next) => {
    /*const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    if (YetkiKontrol(req.body.KullaniciEmail, "SubeIslem") === false) {
        return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' });
    };*/

    const newSube = new SubeModel({
        _id: new mongoose.Types.ObjectId(),
        SubeAd: req.body.SubeAd,
        SubeKonum: req.body.SubeKonum,
    });
    newSube.save().then(result => {
        return res.status(201).json({ message: 'Yeni sube olusturuldu.' });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    });
};

exports.SubeGuncelle = async (req, res, next) => {
    /*const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    if (YetkiKontrol(req.body.KullaniciEmail, "SubeIslem") === false) {
        return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' });
    };*/

    const update = {};
    for (const key of Object.keys(req.body)) {
        if (req.body[key]) { update[key] = req.body[key]; };
    };
    SubeModel.findOneAndUpdate(
        { SubeId: req.body.SubeId },
        { $set: update }
    ).exec().then(result => {
        res.status(200).json({ message: 'Sube guncellendi.' });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    });
};

exports.SubeSil = async (req, res, next) => {
    /*const auth = req.userData;
    if (!auth) { return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' }); };
    if (YetkiKontrol(req.body.KullaniciEmail, "SubeIslem") === false) {
        return res.status(401).json({ message: 'Bu islem icin yetkiniz yoktur.' });
    };*/

    if (results.length == 0) { return res.status(500).json({ message: 'Internal server error' }); };
    SubeModel.findOneAndDelete({ SubeId: req.body.SubeId }).exec().then(result => {
        return res.status(200).json({ message: 'Sube basariyle silindi.' })
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    });
};
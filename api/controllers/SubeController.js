const mongoose = require('mongoose');
const SubeModel = require('../models/SubeModel');

exports.SubeOlustur = async (req, res, next) => {
    try {
        const newSube = new SubeModel({
            _id: new mongoose.Types.ObjectId(),
            SubeAd: req.body.SubeAd,
            SubeAdres: req.body.SubeAdres
        });

        const result = await newSube.save();
        res.status(201).json({
            message: 'Yeni şube oluşturuldu.',
            sube: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

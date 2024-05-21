const mongoose = require('mongoose');

const HavaleModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    GondericiHesapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MusteriModel',
        required: true
    },
    AliciHesapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MusteriModel',
        required: true
    },
    IslemTarihi: { type: Date, required: true },
    IslemTuru: { type: Boolean, required: true },
    IslemTutar: { type: Number, required: true },
});

module.exports = mongoose.model('HavaleModel', HavaleModel);
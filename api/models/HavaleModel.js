const mongoose = require('mongoose');

const HavaleModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    GondericiHesapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MusteriModel'
    },
    AliciHesapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MusteriModel'
    },
    IslemTarihi: { type: Date },
    IslemTuru: { type: Boolean },
    IslemTutar: { type: Number },
});

module.exports = mongoose.model('HavaleModel', HavaleModel);
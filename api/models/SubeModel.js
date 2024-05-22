const mongoose = require('mongoose')

const SubeModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SubeAd: { type: String },
    SubeKonum: { type: String },
})

module.exports = mongoose.model('SubeModel', SubeModel);
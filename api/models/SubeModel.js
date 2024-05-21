const mongoose = require('mongoose')

const SubeModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SubeAd: { type: String, required: true },
    SubeKonum: { type: String, required: true },
})

module.exports = mongoose.model('SubeModel', SubeModel);
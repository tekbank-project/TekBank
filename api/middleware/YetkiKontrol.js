const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');

const KullaniciModel = require('../models/KullaniciModel');

exports.YetkiKontrol = async (KullaniciEmail, Action) => {
    KullaniciModel.find({ email: KullaniciEmail }).exec().then(results => {
        if (results.length == 0) { return false };
        if (results === "root") { return true };
        switch (Action) {
            case "KullaniciSil":
                if (results.KullaniciYetkileri === "Mudur" || results.KullaniciYetkileri === "Personel") { return true; };
                return false;
            case "SubeIslem":
                if (results.KullaniciYetkileri === "Mudur") { return true; };
                return false;
        }
    }).catch(err => {
        console.log(err);
    });
}
const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');

const KullaniciModel = require('../models/KullaniciModel');

exports.YetkiKontrol = async (KullaniciEmail, YetkiToken, Action) => {
    KullaniciModel.find({ KullaniciEmail: KullaniciEmail }).exec().then(results => {
        if (results.YetkiToken !== YetkiToken) { return false; }
        if (results.length == 0) { return false };
        if (results === "root") { return true };
        switch (Action) {
            case "KullaniciSil":
                if (results.KullaniciYetkileri === "Mudur" || results.KullaniciYetkileri === "Personel") { return true; };
                return false;
            case "HesapGuncelleme":
                if (results.KullaniciYetkileri === "Mudur" || results.KullaniciYetkileri === "Personel") { return true; };
                return false;
            case "SubeIslem":
                if (results.KullaniciYetkileri === "Mudur") { return true; };
                return false;
        }
    }).catch(err => { console.log(err); });
}
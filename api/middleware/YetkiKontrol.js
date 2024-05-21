const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');

const KullaniciModel = require('../models/KullaniciModel');

exports.YetkiKontrol = (KullaniciEmail, YetkiToken, Action) => {
    return new Promise((resolve, reject) => {
        KullaniciModel.findOne({ KullaniciEmail: KullaniciEmail })
            .then(user => {
                if (!user) {
                    return resolve(false); // Kullanıcı bulunamadı
                }

                if (user.YetkiToken !== YetkiToken) {
                    return resolve(false); // Yetki tokenları eşleşmiyor
                }

                if (user.KullaniciYetkileri === "root") {
                    return resolve(true); // Root kullanıcısı her zaman yetkilidir
                }

                switch (Action) {
                    case "KullaniciSil":
                        return resolve(user.KullaniciYetkileri === "Mudur" || user.KullaniciYetkileri === "Personel");
                    case "HesapGuncelleme":
                        return resolve(user.KullaniciYetkileri === "Mudur" || user.KullaniciYetkileri === "Personel");
                    case "SubeIslem":
                        return resolve(user.KullaniciYetkileri === "Mudur");
                    default:
                        return resolve(false); // Geçersiz eylem
                }
            })
            .catch(err => {
                console.log(err);
                return resolve(false); // Hata durumunda false döndür
            });
    });
};

'use strict';
import bcrypt from "bcrypt";

export default class UserHelper  {
     checkPassword = (password, hash) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function (err, res) {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    };
     hashPassword = (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    return reject(err);
                }
                return resolve(hash);
            });
        });

    };
}
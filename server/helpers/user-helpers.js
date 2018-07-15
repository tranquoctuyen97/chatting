'use strict';
import Bcrypt from "bcrypt";

export default class UserHelper  {
     checkPassword = (password, hash) => {
        return new Promise((resolve, reject) => {
            Bcrypt.compare(password, hash, function (err, res) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(res);
                }
            });
        });
    };
     hashPassword = (password) => {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    return reject(err);
                }
                return resolve(hash);
            });
        });

    };
}
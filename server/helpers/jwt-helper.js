'use strict';
import JWT from 'jsonwebtoken';

export default class JWTHelper {

     async sign (privateKey, data) {
        return new Promise((resolve, reject) => {
            JWT.sign(data, privateKey, {
                expiresIn: 60 * 30
            }, (err, token) => {
                if (err) {
                    return reject(err);
                }
                return resolve(token);
            });
        });
    };

     async verify (token, privateKey) {
        return new Promise((resolve, reject) => {
            JWT.verify(token, privateKey, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

}
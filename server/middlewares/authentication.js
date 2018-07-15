'user strict';
import {response, JWTHelper} from '../helpers';
export default class  Authentication {
    static isAuth = async (req, res, next) => {
        try {
            let token = null;
            // const pattern = /^Bearer \S./;
            if (req.query.token !== undefined) {
                token = req.query.token;
            } else if (req.headers.authorization !== undefined) {
                token = req.headers.authorization;
            } else if (req.body.token !== undefined) {
                token = req.body.token;
            }
            if (token !== null && token.indexOf('Bearer') !== -1) {
                const tokens = token.split('Bearer ');
                token = tokens[1];
            }
            // if (pattern.test(token) && token !== null){
            //     const tokens = token.split('Bearer ');
            //         token = tokens[1];
            // }
            if (token === null) {
                return response.returnError(res, new Error('Token is null'));
            }
            const user = await JWTHelper.verify(token, 'Tran_Quoc_Tuyen_97');
            req.user = user;
            return next();
        } catch (e) {
            return response.returnError(res, e);
        }
    }
}

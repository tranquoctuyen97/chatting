import Response from "../helpers/response-helper";

'user strict';
import {response, JWTHelper} from '../helpers';
export default class  Authentication {
    static isAuth = async (req, res, next) => {
        try {
            let token = null;
            let authorization = null;
            let user = null;
            if (req.query.token !== undefined) {
                token = req.query.token;
            } else if (req.headers.authorization !== undefined) {
                authorization = req.headers.authorization;
            } else if (req.body.token !== undefined) {
                authorization = req.body.token;
            }
            if (token) {
                user =  await JWTHelper.verify(token, 'Tran_Quoc_Tuyen_97');
            } else if (authorization) {
                const tokens = authorization.split('Bearer ');
                if (tokens.length !== 2) {
                    return response.returnError(res, new Error('Token is wrong format'));
                }
                user = await JWTHelper.verify(tokens[1], 'Tran_Quoc_Tuyen_97');
            }
            req.user = user;
            return next();
        } catch (e) {
            return response.returnError(res, e);
        }
    }
}

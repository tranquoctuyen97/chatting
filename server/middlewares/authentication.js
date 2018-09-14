'user strict';
import {response, JWTHelper} from '../helpers';
import  { userRepository } from '../repositories'
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
                user =  await JWTHelper.verify(token);
            } else if (authorization) {
                const tokens = authorization.split('Bearer ');
                if (tokens.length !== 2) {
                    return response.returnError(res, new Error('Token is wrong format'));
                }
                user = await JWTHelper.verify(tokens[1]);
            }
            req.user = user;
            return next();
        } catch (e) {
            return response.returnError(res, e);
        }
    }
    static authenticateSocket = async (socket) => {
        const token = socket.handshake.query.token;
        if (token === undefined) {
            return Promise.reject(new Error ('Cannot authenticate your connection'));
        }
        const jwtData = await JWTHelper.verify(token);
        const userLogin = await userRepository.getOne({
            where: {
                id: jwtData.id
            }
        });
        if (!userLogin) {
            return response.returnError(res, new Error ('User not found'));
        }
        socket.user = userLogin;
    }
}
'use strict';
import {User, Op, Block} from '../models/index';
import {response, UserHelper, JWTHelper} from '../helpers';


export default class UserController {

    getListUser = async (req, res, next) => {
        try {
            const users = await User.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {
                        model: Block,
                        as: 'blocks',
                        required: false
                    }
                ],
            });
            return response.returnSuccess(res, users);
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: e.message
            });
        }
    };

    createUser = async (req, res, next) => {
        try {
            const {username, password, address} = req.body;
            if (!Array.isArray(address) || address.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Address is invalid !'
                });
            }
            const hashPassword = await UserHelper.hashPassword(password);
            const user = await User.create({
                username,
                password: hashPassword,
                address
            });
            return response.returnSuccess(res, user);
        } catch (e) {
            return response.returnError(res, e);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const user = req.user;
            const {username, address} = req.body;
            const users = await User.update(
                {
                    username,
                    address
                },
                {
                    where: {
                        id: user.id
                    },
                    returning: true
                }
            );
            if (users[0] === 0) {
                return response.returnError(res, new Error('update user error'));
            }
            return response.returnSuccess(res, users[1]);
        } catch (e) {
            return response.returnError(res, e);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            const {id} = req.params;
            await User.destroy({
                where: {
                    id
                }
            });
            return response.returnSuccess(res, true);
        } catch (e) {
            return response.returnError(res, e);
        }
    };

    getOneUser = async (req, res, next) => {
        try {
            const {id} = req.params;
            const user = await User.findById(id);
            if (!user) {
                return response.returnError(res, new Error('User is not found'));
            }
            return response.returnSuccess(res, user);
        } catch (e) {
            return response.returnError(res, e);
        }
    };

    getUserByUsername = async (req, res, next) => {
        try {
            const {username} = req.params;
            const user = await User.find({
                where: {
                    username: {
                        [Op.iLike]: '%' + username
                    }
                }
            });
            if (user.length === 0) {
                return response.returnError(res, new Error('User is not exist'));
            }
            return response.returnSuccess(res, user);
        } catch (e) {
            return response.returnError(res, e);
        }
    };

    changePassword = async (req, res, next) => {
        try {
            const user = req.user;
            const { password, newPassword } = req.body;
            const users = await UserHelper.findUserbyId(user.id);
            const isValid = await UserHelper.checkPassword(password, users.password);
            if (isValid === false) {
                return response.returnError(res, new Error('Password is not coincide'));
            }
            const hash = await UserHelper.hashPassword(newPassword);
            const update = await User.update(
                {
                    password: hash
                },
                {
                    where: {
                        id: user.id
                    },
                    returning: true
                }
            );
            return response.returnSuccess(res, update[1]);
        } catch (e) {
            return response.returnError(res, e);
        }
    };

    login = async (req, res, next) => {
        try {
            const {username, password} = req.body;
            if (username === undefined) {
                return response.returnError(res, new Error('username is invalid !'));
            }
            if (password === undefined) {
                return response.returnError(res, new Error('password is invalid !'));
            }
            const user = await User.find({
                where: {
                    username
                },
                attributes: ['id', 'username', 'password']
            });
            if (!user) {
                return response.returnError(res, new Error('User is not exist'));
            }
            const isPassword = await UserHelper.checkPassword(password, user.password);
            if (!isPassword) {
                return response.returnError(res, new Error('Password is wrong '));
            }
            const token = await JWTHelper.sign('Tran_Quoc_Tuyen_97', {
                id: user.id,
                username: user.username
            });
            return response.returnSuccess(res, {
                token
            });
        } catch (e) {
            return response.returnError(res, e);
        }
    };

}
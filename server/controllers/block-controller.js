'use strict';
import {User,Op} from '../models/index';
import {response, UserHelper} from '../helpers/index'
import bcrypt from 'bcrypt';

export default class UserController {
    getListUser = async (req, res, next) => {
        try {
            const users = await User.findAll({
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            response.returnSuccess(res, users);
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
            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (e) {
            return res.status(400).json({
                success: true,
                error: e.message
            });
        }
    };
    updateUser = async (req, res, next) => {
        try {
            const {id} = req.params;
            const {username, address} = req.body;
            const user = await User.update(
                {
                    username,
                    address
                },
                {
                    where: {
                        id
                    },
                    returning: true
                }
            );
            if (user[0] === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'update user error !'
                });
            }
            ;
            return res.status(200).json({
                success: true,
                data: user[1]
            });
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: e.message
            });
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
            return res.status(200).json({
                success: true,
                data: 'Deleted 1 user'
            });
        } catch (e) {
            return res.status(400).json({
                success: false,
                data: e.message
            });
        }
    };
    getOneUser = async (req, res, next) => {
        try {
            const {id} = req.params;
            const user = await User.findById(id);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'User is not found'
                });
            }
            ;
            return res.status(200).json({
                success: true,
                data: user
            });

        } catch (e) {
            return res.status(400).json({
                success: false,
                error: e.message
            });
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
                return res.status(400).json({
                    success: false,
                    error: 'User is not exist'
                });
            }
            return res.status(200).json({
                success: true,
                data: user
            });

        } catch (e) {
            return res.status(400).json({
                success: false,
                error: e.message
            });

        }
    };

    changePassword = async (req, res, next) => {
        try {
            const {id} = req.params;
            const {password, newPassword} = req.body;
            const user = await  User.findById(id);
            if (await UserHelper.checkPassword(password, user.password) === false) {
                return res.status(400).json({
                    success: false,
                    error: 'Password is not coincide !'
                });
            }
            const hash = await UserHelper.hashPassword(newPassword);
            const update = await User.update(
                {
                    password: hash
                },
                {
                    where: {
                        id
                    },
                    returning: true
                }
            );
            return res.status(200).json({
                success: true,
                data: update[1]
            });
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: e.message
            });
        }
    };
    login = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            if (username === undefined) {
                return response.returnError(res, new Error('username is invalid !'));
            }
            if (password === undefined) {
                return response.returnError(res, new Error('password is invalid !'));
            }
            const user = await User.find({
                where: {
                    username
                }
            });
            if (!user) {
                return response.returnError(res, new Error('User is not exist'));
            }
            const  isPassword = await UserHelper.checkPassword(password, user.password);
            if (!isPassword ) {
                return response.returnError(res, new Error('Password is false'));
            }
            return response.returnSuccess(res, 'login success !');
        } catch (e) {
            return response.returnError(res, e);
        }
    };


}
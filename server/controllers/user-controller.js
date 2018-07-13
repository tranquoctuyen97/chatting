'use strict';
import {User,Op} from '../models/index';
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';

export default class UserController {
    getListUser = async (req, res, next) => {
        try {
            const users = await User.findAll({
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            return res.status(200).json({
                success: true,
                data: users
            });
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: 'List User is error !'
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
            const hashPassword = await this.hashPassword(password);
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
    getUserbyUserName = async (req, res, next) => {
        try {
            const {username} = req.params;
            const user = await User.findAll({
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
    changePassword = async (req, res, next) => {
        try {
            const {id} = req.params;
            const {password, newpassword} = req.body;
            const user = await  this.getUserbyId(id);
            if (await this.checkPassword(password, user.password) === false) {
                return res.status(400).json({
                    success: false,
                    error: 'Password is not coincide !'
                });
            }
            const hash = await this.hashPassword(newpassword);
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
    getUserbyId = async (id) => {
        try {
            const user = await User.findById(id);
            return user;
        } catch (e) {
            return null;
        }
    };


}
'use strict';
import {Group, User} from '../models/index';
import {response} from '../helpers';
import UserHelper from "../helpers/user-helpers";
export default class UserController {
    getListGroup = async (req, res, next) => {
        try {
            const groups = await Group.findAll({
                attributes: {
                    exclude: ['authorId']
                },
                include: [
                    {
                        model: User,
                        as: 'author'
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
            });
            response.returnSuccess(res, groups);
        } catch (e) {
            response.returnError(res, e);
        }
    };
    createGroup = async (req, res, next) => {
        try {
            const user = req.user;
            const { name, avatar, type } = req.body;
            if (!type) {
                return response.returnError(res, new Error('type is required field'));
            }
            const group = await Group.create({
                name,
                avatar,
                type,
                authorId: user.id
            });
            response.returnSuccess(res, group);
        } catch (e) {
            response.returnError(res, e);
        }
    };
    getGroupById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const group = await Group.findById(id);
            if (!group) {
                return response.returnError(res, new Error('Group is invaild'));
            }
            return response.returnSuccess(res, group);
        } catch (e) {
            return response.returnError(res, e);
        }
    };
    getGroupByName = async (req, res, next) => {
        try {
            const { name } = req.params;
            const group = await Group.find({
                where: {
                    name
                }
            });
            if (!group) {
                return response.returnError(res, new Error('Group is invaild'));
            }
            return response.returnSuccess(res, group);
        } catch (e) {
            return response.returnError(res, e);
        }
    };
    deleteGroup = async(req, res, next) => {
        try {
            const { id } = req.params;
            await Group.destroy({
                where:{
                    id
                }
            });
            return response.returnSuccess(res, 'Deleted 1 group');
        } catch (e) {
            return response.returnError(res, e);
        }

    };
    updateGroup = async (req, res, next) => {
        try {
            const user = req.user;
            const { id } = req.params;
            const { name, avatar, type } = req.body;
            const groups = await  Group.update(
                {
                    name,
                    avatar,
                    type,
                    authorId: user.id
                },
                {
                    where: {
                        id
                    }
                }
            );
            if (groups[0] === 0) {
                return response.returnError(res, new Error('update group error'));
            }
            return response.returnSuccess(res, groups[1]);
        } catch (e) {
            return response.returnError(res, e);
        }
    }
    ;

}
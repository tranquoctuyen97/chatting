'use strict';
import {Group, User} from '../models/index';
import {response} from '../helpers';
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
            const { name, avatar, type, authorId } = req.params;
            if (authorId === undefined) {
                response.returnError(res, new Error('authorId is required field'));
            }
            if (!type) {
                response.returnError(res, new Error('type is required field'));
            }
            const group = Group.create({
                name,
                avatar,
                type,
                authorId
            });
            response.returnSuccess(res, group);
        } catch (e) {
            response.returnError(res, e);
        }

    }

}
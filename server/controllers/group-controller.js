'use strict';
import {Group, User, Block, MemberGroup, Op} from '../models';
import {response} from '../helpers';
export default class UserController {
    getListActiveGroup = async (req, res, next) => {
        try {
            const  user = req.user;
            const groups = await Group.findAll({
                attributes: {
                    exclude: ['authorId']
                },
                include: [
                    {
                        model: User,
                        as: 'author'
                    },
                    {
                        model: MemberGroup,
                        as: 'members',
                        where: {
                            userId: user.id
                        },
                        attributes: []
                    }
                    ,
                    {
                        model: Block,
                        as: 'blocks',
                        where: {
                            groupId: null
                        },
                        attributes: []
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
            const user = req.user;
            const authorId = user.id;
            const { id } = req.params;
           const data = await Group.destroy({
                where:{
                    id,
                    authorId
                }
            });
            return response.returnSuccess(res, data);
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
    };
    getOneGroup = async (req, res, next) => {
        try {
            const { id } = req.params;
            const group = await  Group.find({
                where:{
                    id
                },
                include: [
                    {
                        model: MemberGroup,
                        as: 'members',
                        required: false
                    }
                ]
            });
            return response.returnSuccess(res, group);
        } catch (e) {
            return response.returnError(res, e);
        }
    }

}
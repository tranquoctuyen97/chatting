'use strict';
import {Group, User, Block, MemberGroup, Op} from '../models';
import {response} from '../helpers';
import {memberGroupRepository, groupRepository} from '../repositories'

export default class UserController {
    getListActiveGroup = async (req, res, next) => {
        try {
            const memberGroups = await memberGroupRepository.getAll({
                where: {
                    userId: req.user.id
                },
                attributes: ['groupId']
            });
            const groupIds = memberGroups.map(item => item.groupId);
            const groups = await groupRepository.getAll(
                    {
                        where: {
                            id: groupIds
                        },
                        attributes: {
                            exclude: ['authorId']
                        },
                        order: [
                            ['createdAt', 'DESC']
                        ]
                    }
                );
            return response.returnSuccess(res, groups);
        } catch (e) {
            return response.returnError(res, e);
        }
    };
    createGroup = async (req, res, next) => {
        let newGroup = null;
        try {
            const user = req.user;
            const {name, type, memberIds, partnerId} = req.body;
            let memberGroupIds = [];
            switch (type) {
                case 'private':
                    if (partnerId === undefined || partnerId === '') {
                        return response.returnError(res, new Error('partnerId is invalid'))
                    }
                    const existGroup = groupRepository.getOne({
                        where: {
                            [Op.or]: [
                                {
                                    authorId: user.id,
                                    partnerId: partnerId
                                },
                                {
                                    partnerId: user.id,
                                    authorId: partnerId
                                }
                            ]
                        }
                    });
                    if (existGroup) {
                        return response.returnError(res, new Error('Group is Exist'));
                    }
                    memberGroupIds = [user.id, partnerId];
                    break;
                case 'group':
                    if (name === undefined) {
                        return response.returnError(res, new Error('Name group is invalid'));
                    }
                    if (memberIds === undefined || !Array.isArray(memberIds) || memberIds.length === 0) {
                        return response.returnError(res, new Error('Member group is invalid'));
                    }
                    if (!memberIds.includes(user.id)) {
                        memberIds[memberIds.length] = user.id;
                    }
                    memberGroupIds = memberIds;
                    break;
                default:
                    return response.returnError(res, new Error('Type group is invalid'));
            }
            newGroup = await groupRepository.create({
                name,
                authorId: user.id,
                type,
                partnerId
            });
            const memberGroups = memberGroupIds.map(item => {
                return {
                    userId: item,
                    groupId: newGroup.id
                }
            });
            const memberGroup = await MemberGroup.bulkCreate(memberGroups, {returning: true});
            if (!memberGroup) {
                return response.returnError(res, new Error('Create member error'));
            }
            return response.returnSuccess(res, newGroup);
        } catch (e) {
            if (newGroup) {
                Group.destroy({
                    force: true,
                    where: {
                        id: newGroup.id
                    }
                });
            }
            return response.returnError(res, e);
        }
    };
    getGroupByName = async (req, res, next) => {
        try {
            const {name} = req.params;
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
    deleteGroup = async (req, res, next) => {
        try {
            const user = req.user;
            const authorId = user.id;
            const {id} = req.params;
            const data = await Group.destroy({
                where: {
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
            const {id} = req.params;
            const {name, avatar, type} = req.body;
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
            const {id} = req.params;
            const group = await  Group.find({
                where: {
                    id
                },
                include: [
                    {
                        model: MemberGroup,
                        as: 'members',

                    }
                ]
            });
            return response.returnSuccess(res, group);
        } catch (e) {
            return response.returnError(res, e);
        }
    }


}
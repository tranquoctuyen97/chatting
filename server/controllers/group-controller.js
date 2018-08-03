'use strict';
import {Group, User, Block, MemberGroup, Op} from '../models';
import {response} from '../helpers';
import {memberGroupRepository, groupRepository} from '../repositories'

export default class UserController {
    getListActiveGroup = async (req, res, next) => {
        try {
            const user = req.user;
            const groups = memberGroupRepository.getAll({
                where: {
                    userId: user.id
                },
                attributes: ['groupId']
            });
            const groupIds = groups.map(item => item.groupId);
            const listActiveGroups = await groupRepository.getAll({
                attributes: {
                    exclude: ['authorId']
                },
                where: {
                    id: groupIds
                },
                order: [
                    ['createdAt', 'DESC']
                ],
            });
            response.returnSuccess(res, listActiveGroups);
        } catch (e) {
            response.returnError(res, e);
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
    getListMembersGroup = async (req, res, next) => {
        try {
            const {id} = req.params;
            const member = await  Group.find({
                attributes: ['id', 'name'],
                include: [
                    {
                        model: MemberGroup,
                        as: 'members',
                        where: {
                            isExist: true
                        }
                    },
                    {
                        model: Block,
                        as: 'blocks',
                        required: false,
                        where: {
                            userId: null
                        },
                        attributes: []
                    }
                ],
                where: {
                    id
                }
            });
            response.returnSuccess(res, member);
        } catch (e) {
            response.returnSuccess(res, e);
        }
    };
    joinGroup = async (req, res, next) => {
        try {
            const {id} = req.params;
            const user = req.user;
            const {userId} = req.body;
            const isMember = MemberGroup.find({
                where: {
                    groupId: id,
                    userId: user.id
                }
            });
            if (!isMember) {
                response.returnError(res, new Error('you are not member in group'));
            }
            const member = await  MemberGroup.create({
                groupId: id,
                userId
            });
            response.returnSuccess(res, member);
        } catch (e) {
            response.returnError(res, e);
        }
    };
    leaveGroup = async (req, res, next) => {
        try {
            const {id} = req.params;
            const user = req.user;
            const deleted = await  MemberGroup.destroy({
                where: {
                    groupId: id,
                    userId: user.id
                }
            });
            console.log(deleted)
            if (deleted === 0) {
                response.returnError(res, new Error('Leave Group Error !'));
            }
            response.returnSuccess(res, update[1]);
        } catch (e) {
            response.returnError(res, e);
        }
    }

}
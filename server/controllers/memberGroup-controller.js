'use strict';
import {User,Op,Block,Group} from '../models/index';
import {response} from '../helpers/index';
import  {memberGroupRepository, groupRepository} from '../repositories'

export default class MemberGroup {
    getListMembersGroup = async (req, res, next) => {
        try {
            const {id} = req.params;
            const member = await  memberGroupRepository.getAll({
                where: {
                    groupId: id
                }
            });
            if (member.length === 0) {
                return response.returnError(res, new Error('Group is not Exist'))
            }
            return response.returnSuccess(res, member);
        } catch (e) {
            return response.returnSuccess(res, e);
        }
    };

    joinGroup = async (req, res, next) => {
        try {
            const {id} = req.params;
            const user = req.user;
            const {userId} = req.body;
            const isMember = memberGroupRepository.getOne({
                where: {
                    groupId: id,
                    userId: user.id
                }
            });
            if (!isMember) {
                response.returnError(res, new Error('you are not member in group'));
            }
            const member = await  memberGroupRepository.create({
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
            const isAuthor = groupRepository.getAll({
               where: {
                   id,
                   authorId: user.id

               }
            });
            if (!isAuthor) {
                await groupRepository.delete({
                    where: {
                        id
                    }
                });
                return response.returnSuccess(res, true);
            }
            const deleted = await  memberGroupRepository.delete({
                where: {
                    groupId: id,
                    userId: user.id
                }
            });
            if (deleted === 0) {
                return response.returnError(res, new Error('Leave Group Error !'));
            }
            return response.returnSuccess(res, true);
        } catch (e) {
            return response.returnError(res, e);
        }
    };

}
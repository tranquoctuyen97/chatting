import {Message, Group, User, Block, MemberGroup, Op} from '../models';
import {response} from '../helpers';
export default class MessageController {
    getListMessage = async (req, res, next) => {
        try {
            const { id } = req.params;
            const  user = req.user;
            const messages = await Message.findAll({
                attributes: {
                    exclude: [ 'groupId' ]
                },
                distinct: true,
                include: [
                    {
                        model:Group,
                        as: 'group',
                        where: {
                            id: id
                        },
                        attributes: []
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['avatar','username' ]
                    }
                ],
                order: [
                    ['createdAt','ASC']
                ]
            });
            return response.returnSuccess(res, messages);
        } catch (e) {
            return response.returnError(res, e);
        }
    };
    createMessage = async (req, res, next) => {
        try {
            const user = req.user;
            const { type, groupId, body } = req.body;
            // let isBlocked ;
            // if (type === 'private') {
            //     const author = await Group.find({
            //         attributes: ['authorId'],
            //         where: {
            //             id: groupId
            //         }
            //     });
            //     isBlocked = await Group.find({
            //         attributes: [],
            //         include: [
            //             {
            //                 model: MemberGroup,
            //                 as: 'members',
            //                 where: {
            //                     userId: user.id
            //                 },
            //                 required: false,
            //             },
            //             {
            //                 model: Block,
            //                 as: 'blocks',
            //                 where: {
            //                     userId: user.id,
            //                     authorId: author.authorId,
            //                     groupId: null
            //                 },
            //                 required: false,
            //             },
            //         ]
            //     });
            // }
            // if (type === 'group') {
            //     isBlocked = await Group.find({
            //         attributes: [],
            //         include: [
            //             {
            //                 model: MemberGroup,
            //                 as: 'members',
            //                 where: {
            //                     userId: user.id
            //                 },
            //                 required: false,
            //             }
            //         ]
            //     });
            // }

            if (groupId === undefined){
                return response.returnError(res, new Error('groupId is invalid'));
            }
            if (!type) {
                return response.returnError(res, new Error('type is invalid'));
            }

            // if (isBlocked.members.length === 0){
            //     return response.returnError(res, new Error('YOU are not member in group !'));
            // }
            // if (isBlocked.blocks.length !== 0 ){
            //     return response.returnError(res, new Error('YOU are blocked'));
            // }
            const message = await Message.create({
                authorId: user.id,
                type,
                groupId,
                body
            });
            return response.returnSuccess(res, message);

        } catch (e) {
            return response.returnError(res, e);
        }
    };
    updateMessage = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { authorId, type, groupId, body } = req.body;
            if (authorId === undefined) {
                return response.returnError(res, new Error('authorId is invalid'));
            }
            if (groupId === undefined){
                return response.returnError(res, new Error('groupId is invalid'));
            }
            if (!type) {
                return response.returnError(res, new Error('type is invalid'));
            }
            const messages = await Message.update(
                {
                authorId,
                type,
                groupId,
                body
                },
                {
                    where: {
                        id
                    },
                    returning: true
                });
            if (messages[0] === 0) {
                return response.returnError(res, new Error('Update is error'));
            }
            return response.returnSuccess(res, messages[1]);
        } catch (e) {
            return response.returnError(res, e);

        }
    };
    deleteMessage = async (req, res, next) => {
        try {
            const { id } = req.params;
            await Message.destroy({
                where:{
                   id
                }
            }
            );
            return response.returnSuccess(res, 'deleted 1 message');
        } catch (e) {
            return response.returnError(res, e);
        }
    };

}
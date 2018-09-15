import {Message, Group, User, Block, MemberGroup, Op} from '../models';
import {messageRepository} from '../repositories'
import {response} from '../helpers';
export default class MessageController {
    getListMessage = async (req, res, next) => {
        try {
            const { id } = req.params;
            const {page, limit } = req.query;
            const offset = (page - 1) * limit;
            const  user = req.user;
            const  messages = await  messageRepository.getAll({
                offset,
                limit,
                where: {
                    groupId: id
                },
                include: [
                    {
                        model: User,
                        as: 'author',
                    }
                ],
                order: [
                    ['createdAt','DESC']
                ],

            });

            return response.returnSuccess(res, messages);
        } catch (e) {
            return response.returnError(res, e);
        }
    };
    createMessage = async (req, res, next) => {
        try {
            const   groupId = req.params.id;
            const user = req.user;
            const { type, body } = req.body;

            if (groupId === undefined){
                return response.returnError(res, new Error('groupId is invalid'));
            }
            if (!type) {
                return response.returnError(res, new Error('type is invalid'));
            }

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
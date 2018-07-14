import {Message, Group, User} from '../models';
import {response} from '../helpers';
export default class MessageController {
    getListMessage = async (req, res, next) => {
        try {
            const messages = await Message.findAll({
                attributes: {
                    exclude: ['authorId']
                },
                include: [
                    {
                        model:Group,
                        as: 'group'
                    },
                    {
                        model: User,
                        as: 'user'
                    }
                ],
                order: [
                    ['createdAt','DESC']
                ]
            });
            return response.returnSuccess(res, messages);
        } catch (e) {
            return response.returnError(res, e);
        }
    };
    createMessage = async (req, res, next) => {
        try {
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
            const message = await Message.create({
                authorId,
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

    getMessageById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const message = await Message.findById(id);
            if (!message) {
                return response.returnError(res, new Error('Message is not exist'));
            }
            return response.returnSuccess(res, message);
        } catch (e) {
            return response.returnError(res, e);
        }
    };

}
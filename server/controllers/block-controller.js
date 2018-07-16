'use strict';
import {User,Op,Block,Group} from '../models/index';
import {response} from '../helpers/index'

export default class BlockController {
    createBlock = async (req, res, next) => {
        try {
            const {userId,groupId} = req.body;
            const user = req.user;
            console.log(user)
            const block = await Block.create({
                userId,
                groupId,
                authorId: user.id

            });
            return response.returnSuccess(res, block);
        } catch (e) {
            return response.returnError(res, e);
        }
    };



}
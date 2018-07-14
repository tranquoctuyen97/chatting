'use strict';
import {User,Op,Block,Group} from '../models/index';
import {response} from '../helpers/index'

export default class BlockController {
    getListUsers = async (req, res, next) => {
        try {
            const Block = await User.hasMany(Block, {as: 'authors'});
            const users = await User.findAll({

                order: [
                    ['createdAt', 'DESC']
                ],
                attributes:
                    ['username','password'],
                include: [
                    {
                        model: Block,
                        as: 'authors'
                    }
                ]


            });
            response.returnSuccess(res, users);
        } catch (e) {
            return response.returnError(res, e);
        }
    };



}
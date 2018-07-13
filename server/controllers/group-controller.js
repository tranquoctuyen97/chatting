'use strict';
import {Group} from '../models/index';
export default class UserController {

    get = async (req, res) => {
        Group
            .find()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(400).json(error);
            });
    };

}
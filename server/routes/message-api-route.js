'use strict';

import {messageController} from '../controllers/index';
import {Authentication} from "../middlewares";

module.exports = (app) => {

    app.route('/messages')
        .get([Authentication.isAuth], messageController.getListMessage)
        .post([Authentication.isAuth],messageController.createMessage);
    app.route('/message/:id')
        .get(messageController.getMessageById)
        .put(messageController.updateMessage)
        .delete(messageController.deleteMessage);


};

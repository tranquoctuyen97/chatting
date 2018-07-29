'use strict';

import {messageController} from '../controllers/index';
import {Authentication} from "../middlewares";

module.exports = (app) => {

    app.route('/messages')
        .post([Authentication.isAuth],messageController.createMessage);
    app.route('/message/:id')
        .put([Authentication.isAuth], messageController.updateMessage)
        .delete([Authentication.isAuth], messageController.deleteMessage);
    app.route('/group/:id/messages')
        .get(Authentication.isAuth, messageController.getListMessage);



};

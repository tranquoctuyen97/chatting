'use strict';

import {messageController} from '../controllers/index';
import {Authentication} from "../middlewares";

module.exports = (app) => {
    app.route('/groups/:id/messages')
        .get(Authentication.isAuth, messageController.getListMessage)
        .put([Authentication.isAuth], messageController.updateMessage)
        .delete([Authentication.isAuth], messageController.deleteMessage)
        .post([Authentication.isAuth],messageController.createMessage);;




};

'use strict';

import {messageController} from '../controllers/index';

module.exports = (app) => {

    app.route('/messages')
        .get(messageController.getListMessage)
        .post(messageController.createMessage);
    app.route('/message/:id')
        .get(messageController.getMessageById)
        .put(messageController.updateMessage)
        .delete(messageController.deleteMessage);


};

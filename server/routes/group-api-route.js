'use strict';

import {groupController} from '../controllers';
import {Authentication} from '../middlewares';
import {messageController} from "../controllers";

module.exports = (app) => {

	app.route('/groups')
		.get([Authentication.isAuth],groupController.getListActiveGroup)
		.post([Authentication.isAuth],groupController.createGroup);
    app.route('/group/:id')
		.get([Authentication.isAuth],groupController.getOneGroup)
    	.delete([Authentication.isAuth],groupController.deleteGroup)
		.put([Authentication.isAuth],groupController.updateGroup)
		.post([Authentication.isAuth],groupController.joinGroup);
    app.route('/group/search/:name')
		.get([Authentication.isAuth],groupController.getGroupByName);
    app.route('/group/:id/members')
        .get(groupController.getListMembersGroup);
    app.route('/group/:id/leaveGroup')
        .put([Authentication.isAuth], groupController.leaveGroup);
    app.route('/group/:id/messages')
        .get(Authentication.isAuth, messageController.getListMessage);
};

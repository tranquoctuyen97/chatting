'use strict';

import {groupController} from '../controllers/index';
import {Authentication} from '../middlewares';

module.exports = (app) => {

	app.route('/groups')
		.get([Authentication.isAuth],groupController.getListActiveGroup)
		.post([Authentication.isAuth],groupController.createGroup);
    app.route('/group/:id')
		.get([Authentication.isAuth],groupController.getOneGroup)
    	.delete([Authentication.isAuth],groupController.deleteGroup)
		.put([Authentication.isAuth],groupController.updateGroup)
		.post([Authentication.isAuth],groupController.JoinGroup);
    app.route('/group/search/:name')
		.get([Authentication.isAuth],groupController.getGroupByName);
    app.route('/group/:id/members')
        .get(groupController.getListMembersGroup)
};

'use strict';

import {groupController} from '../controllers/index';
import {Authentication} from '../middlewares';

module.exports = (app) => {

	app.route('/groups')
		.get([Authentication.isAuth],groupController.getListGroup)
		.post([Authentication.isAuth],groupController.createGroup);
    app.route('/group/:id')
        .get([Authentication.isAuth],groupController.getGroupById)
    	.delete([Authentication.isAuth],groupController.deleteGroup)
		.put([Authentication.isAuth],groupController.updateGroup);
    app.route('/group/search/:name')
		.get([Authentication.isAuth],groupController.getGroupByName);

};

'use strict';

import {groupController} from '../controllers';
import {Authentication} from '../middlewares';
import {messageController} from "../controllers";

module.exports = (app) => {

	app.route('/groups')
		.get([Authentication.isAuth],groupController.getListActiveGroup)
		.post([Authentication.isAuth],groupController.createGroup);
    app.route('/groups/:id')
		.get([Authentication.isAuth],groupController.getOneGroup)
    	.delete([Authentication.isAuth],groupController.deleteGroup)
		.put([Authentication.isAuth],groupController.updateGroup);
    app.route('/groups/search/:name')
		.get([Authentication.isAuth],groupController.getGroupByName);

};

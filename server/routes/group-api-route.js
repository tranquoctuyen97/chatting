'use strict';

import {groupController} from '../controllers/index';

module.exports = (app) => {

	app.route('/groups')
		.get(groupController.getListGroup)
		.post(groupController.createGroup);


};

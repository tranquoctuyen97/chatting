'use strict';

import {groupController} from '../controllers/index';

module.exports = (app) => {

	app.route('/groups')
		.get(groupController.getListGroup)
		.post(groupController.createGroup);
    app.route('/group/:id')
        .get(groupController.getGroupById)
    	.delete(groupController.deleteGroup)
		.put(groupController.updateGroup);
    app.route('/group/search/:name')
		.get(groupController.getGroupByName);

};

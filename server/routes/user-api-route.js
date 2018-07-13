'use strict';

import {userController} from '../controllers/index';

module.exports = (app) => {

	app.route('/users')
		.get(userController.getListUser)
		.post(userController.createUser);
    app.route('/user/:id')
        .get(userController.getOneUser)
        .put(userController.updateUser)
		.delete(userController.deleteUser)
		;
    app.route('/users/search/:username')
		.get(userController.getUserbyUserName);
	app.route('/users/:id/changePassword')
		.put(userController.changePassword);

};

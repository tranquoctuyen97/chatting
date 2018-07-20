'use strict';

import {userController} from '../controllers';
import {Authentication, RoleManagement} from '../middlewares';


module.exports = (app) => {

	app.route('/users')
		.get([Authentication.isAuth], userController.getListUser)
		.post([Authentication.isAuth], userController.createUser);
    app.route('/user/:id')
        .get([Authentication.isAuth], userController.getOneUser)
        .put([Authentication.isAuth], userController.updateUser)
		.delete([Authentication.isAuth], [RoleManagement.verifyRole], userController.deleteUser);
    app.route('/users/search/:username')
		.get([Authentication.isAuth], userController.getUserByUsername);
	app.route('/users/changePassword')
		.put([Authentication.isAuth], userController.changePassword);
    app.route('/user/:id/changeActive')
        .put([Authentication.isAuth],[RoleManagement.verifyRole], userController.updateActiveUser);
    app.route('/users/login')
        .post(userController.login);


};

'use strict';

import {blockController} from '../controllers/index';
import {Authentication} from '../middlewares';

module.exports = (app) => {

	app.route('/blocks')
		.post([Authentication.isAuth], blockController.createBlock)
		.get([Authentication.isAuth], blockController.getListBlockUser);
    app.route('/users/:id/block/:groupId')
        .post([Authentication.isAuth], blockController.createGroupBlockUser)
		.delete([Authentication.isAuth], blockController.deleteGroupBlockUser);



};

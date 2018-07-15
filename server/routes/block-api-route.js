'use strict';

import {blockController} from '../controllers/index';

module.exports = (app) => {

	app.route('/blocks')
		.get(blockController.getListUsers);



};

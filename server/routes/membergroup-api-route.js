'use strict';

import {memberGroup} from '../controllers';
import {Authentication} from '../middlewares';

module.exports = (app) => {

    app.route('/members/groups/:id')
        .get([Authentication.isAuth], memberGroup.getListMembersGroup);
    app.route('/members/groups/:id/leave')
        .delete([Authentication.isAuth], memberGroup.leaveGroup);
    app.route('/members/groups/:id/invite')
        .post([Authentication.isAuth],memberGroup.joinGroup);




};

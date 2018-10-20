'user strict';
import {response} from '../helpers';
export default class  RoleManagement {
    static verifyRole = async (req, res, next) => {
        try {




            
            const user = req.user;
            const role = user.role;
            if (role === 'normal') {
                return response.returnError(res, new Error('You can not do this!'));
            }
            return next();
        } catch (e) {
            return response.returnError(res, e);
        }
    };
}

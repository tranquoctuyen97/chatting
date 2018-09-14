import { groupController } from '../controllers';
export default class GroupEvent {

    static async initialize (socket) {
        const groupIds = await groupController.getActiveGroupIds(socket.user.id);
        for (const groupId of groupIds) {
            console.log('----------Join to---------');
            console.log(groupId);
            socket.join(groupId);
        }
        socket.on('rooms', function(requestData, callback) {
            switch (requestData.action) {
                case 'join':

            }
        });
    }

}
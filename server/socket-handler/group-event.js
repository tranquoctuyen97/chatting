import { groupController, memberGroup } from '../controllers';
export default class GroupEvent {

    static async initialize (socket) {
        const groupIds = await groupController.getActiveGroupIds(socket.user.id);
        for (const groupId of groupIds) {
            console.log('----------Join to---------');
            console.log(groupId);
            socket.join(groupId);
        }
        socket.on('rooms', async function(requestData, callback) {
            const { userId, groupId } = requestData.data;
            const members = memberGroup.getListMembersGroup({
                params:{
                    id: groupId
                }
            });
            switch (requestData.action) {
                case 'join':
                try {
                      await memberGroup.joinGroup({
                          params: {
                            id: groupId
                          },
                          body: {
                              userId: userId
                          },
                          user: socket.user
                      });
                      socket.broadcast.to(groupId).emit('rooms', {
                          action: 'join',
                          data: {
                              members
                          }
                      });
                      return callback(null, {
                          data: {
                              members
                          }
                      })
                } catch (e) {
                        return callback(e);
                }
            }
        });
    }

}
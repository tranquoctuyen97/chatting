import UserRepository from './user-repository';
import GroupRepository from "./group-repository";
import BlockRepository from "./block-repository";
import MemberGroupRepository from "./memberGroup-repository";
import MessageRepository from "./message-repository";

module.exports = {
    userRepository: new UserRepository(),
    groupRepository: new GroupRepository(),
    blockRepository: new BlockRepository(),
    memberGroupRepository: new MemberGroupRepository(),
    messageRepository: new MessageRepository()

};

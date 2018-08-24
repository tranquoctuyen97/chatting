'use strict';

import Express from 'express';
import BodyParser from 'body-parser';
import Cors from 'cors';
import FS from 'fs-extra';
import Http from 'http';
import Path from 'path';
import {JWTHelper} from "./helpers";

const app = Express();
global.__rootDir = __dirname.replace('/server', '');

app
    .use(Cors())
    .use(BodyParser.json())
    .use(BodyParser.urlencoded({extended: true}))
    .use(Express.static(Path.resolve(__dirname, '..', 'public'), {maxAge: 31557600000}))
    .set('views', Path.join(__dirname, '..', 'public', 'views'))
    .set('view engine', 'ejs');

const routePath = `${__dirname}/routes/`;
FS.readdirSync(routePath).forEach((file) => {
    require(`${routePath}${file}`)(app);
});

const server = Http.createServer(app).listen(3030, () => {
    console.log(`App listening on 3030!`);
});
const io = require('socket.io')(server);

const rooms = {};

io
    .use(async (socket, next) => {
        try {
            const token = socket.handshake.query.token;
            const data = await JWTHelper.verify(token);
            socket.user = data;
            next();
        } catch (e) {
            console.log(e);
            return next(e);
        }
    })
    .on('connection', function (socket) {
        socket.on('rooms', function(requestData, callback) {
            switch (requestData.action) {
                case 'join':
                    const roomName = requestData.data.roomName;
                    if (roomName === undefined) {
                        return;
                    }
                    if (!rooms[roomName]) {
                        rooms[roomName] = [];
                    }
                    let isExisted = false;
                    for (const item of rooms[roomName]) {
                        if (item === socket.user.username) {
                            isExisted = true;
                            break;
                        }
                    }
                    if (!isExisted) {
                        rooms[roomName].push(socket.user.username)
                    }
                    socket.join(requestData.data.roomName);
                    socket.broadcast.to(roomName).emit('rooms', {
                        action: 'join',
                        data: {
                            members: rooms[roomName]
                        }
                    });
                    return callback(null, rooms[roomName]);
                    break;
            }
        });
        socket.on('messages', function (requestData, callback) {
            switch (requestData.action) {
                case 'create':
                    try {
                        const { body, roomName, type} = requestData.data;
                        const senderName = socket.user.username;
                        socket.broadcast.to(roomName).emit('messages', {
                            action: 'create',
                            data: {
                                body,
                                roomName,
                                type,
                                senderName
                            }
                        });
                        return callback( null,  {
                            data: {
                                body,
                                roomName,
                                type,
                                senderName
                            }
                        });
                    } catch (error) {
                        return callback(error);
                    }
                case 'typing':
                    try {
                        const { roomName } = requestData.data;
                        const senderName = socket.user.username;
                        socket.broadcast.to(roomName).emit('messages', {
                            action: 'typing',
                            data: {
                                senderName,
                                roomName
                            }
                        });
                        return callback(null , {
                            data: {
                                senderName,
                                roomName
                            }

                        })
                    } catch (e) {
                        return callback(e);
                    }
                case 'typed':
                    try {
                        const { roomName } = requestData.data;
                        const senderName = socket.user.username;
                        socket.broadcast.to(roomName).emit('messages', {
                            action: 'typed',
                            data: {
                                senderName,
                                roomName
                            }
                        });
                        return callback(null , {
                            data: {
                                senderName,
                                roomName
                            }

                        })
                    } catch (e) {
                        return callback(e);
                    }
            }
        });
        socket.on('disconnect', function () {
            for (const roomName in rooms) {
                for (let i = 0; i < rooms[roomName].length; i++) {
                    if (rooms[roomName][i] === socket.user.username) {
                        rooms[roomName].splice(i, 1);
                        socket.broadcast.to(roomName).emit('rooms', {
                            action: 'userDisconnect',
                            data: {
                                members: rooms[roomName]
                            }
                        })
                    }
                }
            }
        });

    });
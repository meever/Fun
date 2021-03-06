module.exports = function (io) {
    var usernames = {};
    var numUsers = 0;
    var numMessages = 0;
    var messages = [];


    io.on('connection', function (socket) {
        var addedUser = false;
        socket.emit('history', messages.slice(-8));
        socket.emit('new message', {
                username: 'System',
                message: 'type your name below to join the chat!',
                time: new Date()
            })
            // when the client emits 'new message', this listens and executes
        socket.on('new message', function (data) {
            // we tell the client to execute 'new message'
            var time = new Date()
            messages[numMessages++] = {
                username: socket.username,
                message: data,
                time: time
            };
            socket.broadcast.emit('new message', {
                username: socket.username,
                message: data,
                time: time
            });
        });

        // when the client emits 'add user', this listens and executes
        socket.on('add user', function (username) {
            // we store the username in the socket session for this client
            socket.username = username;
            // add the client's username to the global list
            usernames[username] = username;
            ++numUsers;
            addedUser = true;
            socket.emit('login', {
                numUsers: numUsers
            });
            // echo globally (all clients) that a person has connected
            socket.broadcast.emit('user joined', {
                username: socket.username,
                numUsers: numUsers
            });
        });

        // when the client emits 'typing', we broadcast it to others
        socket.on('typing', function () {
            socket.broadcast.emit('typing', {
                username: socket.username
            });
        });

        // when the client emits 'stop typing', we broadcast it to others
        socket.on('stop typing', function () {
            socket.broadcast.emit('stop typing', {
                username: socket.username
            });
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
            // remove the username from global usernames list
            if (addedUser) {
                delete usernames[socket.username];
                --numUsers;

                // echo globally that this client has left
                socket.broadcast.emit('user left', {
                    username: socket.username,
                    numUsers: numUsers
                });
            }
        })
    })
}
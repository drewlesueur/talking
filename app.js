var io = require('socket.io').listen(8401);

people = {}

io.sockets.on('connection', function (socket) {
  socket.emit('server-whoareyou');
  socket.on('client-iam', function (data) {
    people[data] = socket;
    socket.set("name", data, function () {
      socket.get("name", function (err, name) {
        console.log("the name is " + name + ":" + data) 
      })
    })
  });

  socket.on('disconnect', function () {
    socket.get("name", function (name) {
      delete people[name] 
    }) 
  })

  socket.on('client-send', function (name, data) {
    recipient = people[name]
    if (recipient) {
      console.log("found recipient")
      socket.get("name", function (err, from) {
        console.log("from " + from + " to " + name)
        recipient.emit('server-send', from, data)
      })
    }
  })
});

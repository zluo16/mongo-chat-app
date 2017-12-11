const mongo = require('mongodb').MongoClient
const client = require('socket.io').listen(4000).sockets

mongo.connect('mongodb://localhost:27017/mongochat', function(error, backend) {
  if (error) {
    throw error
  }

  const db = backend.db('mongchat')

  console.log('MongoDB connected...');

  client.on('connection', function(socket) {
    let chat = db.collection('chats')

    sendStatus = function(status) {
      socket.emit('status', status)
    }

    chat.find().limit(100).sort({ _id: 1 }).toArray(function(error, res) {
      if (error) {
        throw error
      }

      socket.emit('output', res)
    })

    socket.on('input', function(data) {
      let name = data.name
      let message = data.message

      if (name == ''|| message == '') {
        sendStatus('Please enter a name and message')
      } else {
        chat.insert({ name: name, message: message  }, function() {
          client.emit('output', [data])

          sendStatus({ message: 'Message sent', clear: true })
        })
      }
    })

    socket.on('clear', function(data) {
      chat.remove({}, function() {
        socket.emit('Cleared')
      })
    })
  })
})

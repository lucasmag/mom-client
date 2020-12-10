const { ipcMain } = require('electron')
var amqp = require('amqplib/callback_api');


var exec = require("child_process").exec
console.log("Initializing client...")
/*
messages = {
  ["lucas", "mat"]: [
      {"username": "lucas", "message": "eae mano"},
      {"username": "mat", "message": "tmj"},
    ]
}

*/
let messages = {}

ipcMain.on('consume-messages', (event, queue) => {
  const window = require('electron-main-window').getMainWindow();
  
  amqp.connect('amqp://localhost', function(error0, connection) {
    
    if (error0) {
      throw error0;
    }

    connection.createChannel(function(error1, channel) {

      if (error1) {
        throw error1;
      }

      channel.assertQueue(queue, {
        durable: false
      });

      channel.consume(queue, function(msg) {
        let data = JSON.parse(msg.content.toString())

        window.webContents.send('updateMessages', data)

      }, {
          noAck: true
        });

    });
  });
  event.returnValue = "fila criada"
})

const { ipcMain } = require('electron')
var amqp = require('amqplib/callback_api');

console.log("Initializing client...")

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
        console.log(data);
        window.webContents.send('updateMessages', data)

      }, {
          noAck: true
        });

    });
  });
  event.returnValue = "fila criada"
})

ipcMain.on('consume-topic', (event, data) => {
  const window = require('electron-main-window').getMainWindow();
  
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertExchange(data.topic, 'fanout', {
        durable: false
      });

      channel.assertQueue(data.queue, {
        durable: false,
      })
        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        channel.bindQueue(data.queue, data.topic, '');
      
    });
  });

  event.returnValue = "fila criada"
})
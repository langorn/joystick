
"use strict";


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req,res){
    // res.send('<h1>Hello World</h1>')
    res.sendFile(__dirname+'/arduino.html');
});

// Firmata
var serialPort = '/dev/tty.usbmodem1421';
var board = require('./firmataConnector').start(serialPort);

// Arduino is connected
board.on('connection', function () {
    console.log('connection on')
    // Set pin 13 to output
    board.pinMode(13, board.HIGH);
    
    // WebSocket connection handler
    io.on('connection', function (socket) {
        
        /***********************
            joystick related
        ***********************/
        board.analogRead(board.A0, function(val) {   
            socket.emit('joystick-vertical',val)
        });
        board.analogRead(board.A1, function(val) {   
            console.log(val);
            socket.emit('joystick-horizon',val)
        });

        /* open led light at pin 13 */
        console.log('client connected: '+ socket.id);
        board.digitalWrite(13, board.HIGH);
        
        socket.on('disconnect', function () {
            /* open led light at pin 13 when someone disconnect */

            console.log('client disconnected: '+ socket.id);
            board.digitalWrite(13, board.LOW);
        });

        socket.on('manualClose', function () {
            /* open led light at pin 13 when someone disconnect */
            console.log('client close led: '+ socket.id);
            board.digitalWrite(13, board.LOW);
        });


    });
});

http.listen(3000,function(){
    console.log('listening on port 3000');
})
             
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.get('/',function(req,res){
// 	// res.send('<h1>Hello World</h1>')
// 	res.sendFile(__dirname+'/arduino.html');
// });



io.on('connection',function(socket){
	var assassin = [];
	console.log('1 user connect');
	socket.broadcast.emit('someone log in')
	socket.on('chat message', function(msg){
	    console.log('message: ' + msg);
	    io.emit('chat message', msg);
	});

	socket.on('disconnect',function(){
		console.log('user disconnected');
	})

	 socket.on('users', function(msg){
	      console.log('msg------->'+msg);

	      // console.log('message: ' + msg);
	      // io.emit('chat message', msg);
	      // $('#users').append('<button>'+msg+'</button>');
	  
	      assassin.push(msg);
	      io.emit('whoshere',assassin);

	  });

});


http.listen(13997,function(){
	console.log('listening on port 3000');
})
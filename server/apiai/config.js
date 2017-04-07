const apiai = require('apiai');

const app2 = apiai("ebd9851429fe4b70bc4054e312c2a73f");

var request = app2.textRequest('Play Song Fix You by Coldplay',{
	sessionId: '123456789'
})

request.on('response',(res)=>{
	console.log(res);
});

request.on('error',(err)=>{
	console.log(err);
})

request.end();
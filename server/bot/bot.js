const Bot = require('node-telegram-bot-api');
const request = require('request');
const CronJob = require('cron').CronJob;

const token = '250370137:AAENNkKNX9TUHr9dye1FS4w2FYipzUmLSZg';
const url = 'https://fathomless-caverns-40321.herokuapp.com';

var bot = new Bot(token,{polling: true});

console.log('Telegram server started at ',Date());

var rule = new CronJob('1 * * * * *',()=>{
	console.log('Aleart every second');
	bot.sendMessage(253594721,`Good Morning Krittin ${Date()}`);
},null,true,'America/Los_Angeles');



bot.onText(/\/getTodos/,(msg)=>{
	var text = 'All Todos:';

	bot.sendMessage(msg.chat.id,`Hi *${msg.from.first_name} ${msg.from.last_name}*`);
	console.log('---------MSG---------');
 	console.log(msg);
  	console.log('---------MATCH---------');
  	console.log('f');
  	request(url+'/todos',(err,res,body)=>{
  		
  		bodyObject = JSON.parse(body)
  		console.log(bodyObject);

  		for(i = 1; i<=bodyObject.todos.length ; i++){
  			var todo = bodyObject.todos[i-1];
  			if(todo.completed === false){
  				lastText = '[Incomplete]';
  			} else {
  				lastText= '[Complete]';  			
  			}
  			text = text+`\nTodo ${i}: ${todo.text} ${lastText}`;
  		}
  		bot.sendMessage(msg.chat.id,text); 
  		
  	});
  	 	
})



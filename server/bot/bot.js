const Bot = require('node-telegram-bot-api');
const request = require('request');
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;

const token = '250370137:AAENNkKNX9TUHr9dye1FS4w2FYipzUmLSZg';
const url = 'https://fathomless-caverns-40321.herokuapp.com';

var bot = new Bot(token,{polling: true});

console.log('Telegram server started at ',Date());

var rule = new CronJob('0 0 8 * * *',()=>{
	bot.sendMessage(253594721,`Good Morning Krittin!!🎊 🎉🎊 🎉🎁 It's ${Date()}`);
},true,'Asia/Singapore');

var keepHerokuAlive = new CronJob('0 * * * * *',()=>{
  request('https://polar-savannah-71286.herokuapp.com/',(err,res,body)=>{
    bot.sendMessage(253594721,`Connected to heroku at ${new Date()}. `);
    if(err){
      bot.sendMessage(253594721,'Error!');
    }
  })
},true,'Asia/Singapore');



bot.onText(/\/getTodos/,(msg)=>{
	var text = 'All Todos:';

	bot.sendMessage(msg.chat.id,`Hi ${msg.from.first_name} ${msg.from.last_name}! We are getting todos for you.`);
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

bot.onText(/\/getKeyboard/,(msg)=>{
  var chatID = msg.chat.id;
  var options1 = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: 'Some button text 1'}],
        [{ text: 'Some button text 2'}],
        [{ text: 'Some button text 3'}]
      ],
      resize_keyboard: true,
     one_time_keyboard: true
    })
  };
  bot.sendMessage(msg.chat.id, 'Some text giving three inline buttons', options1).then(function (sended) {
     bot.sendMessage(msg.chat.id,'Please choose something')
  });

  bot.onText(/.+./g,(msg)=>{
    console.log(msg.text);
    bot.sendMessage(chatID,`${msg.text} was sent.`);

    bot.onText(/.+./g,(msg)=>{
      console.log(msg.text);
      bot.sendMessage(chatID,`Thank you!`);
    })
  });

  

} )
  



const express = require('express');
const mongoose = require('mongoose')
const passport = require('passport') 
const session = require('express-session')
const bodyParser = require('body-parser');
var fs = require('fs');
var messagers = JSON.parse(fs.readFileSync('./Data/messagers.json', 'utf8'));
const app = express();
let sendMessage = require('./webhook').sendMessage;
let handlePostback = require('./webhook').handlePostback;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret:'31jda%4*/99=_)787',
  resave: true,
  saveUninitialized: true
}));
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
//require('./passport')(passport);

//mongoose.connect('mongodb+srv://baole1508:<baole>@cluster0-rivpp.mongodb.net/chatbot_learnrussian'); // connect to our database
/******************************************************** */

//app.get('/auth/facebook', passport.authenticate("facebook", { scope: ['email'] }));
//app.get('/auth/facebook/callbackfacebook', passport.authenticate('facebook', { failureRedirect: '/login' ,successRedirect:'https://m.me/AppLearnRussian'}));

app.get('/',(req,res)=>{
   // res.redirect('/auth/facebook');
})
/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'baole') {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).end();
    }
  });
 

  function randomInteger(min, max) {
    var rand = min + Math.random() * (max - min)
    rand = Math.round(rand);
    return rand;
  }
  /* Handling all messenges */
  app.post('/webhook', (req, res) => {
    if (req.body.object === 'page') {
      req.body.entry.forEach((entry) => {
        entry.messaging.forEach((event) => {
          let sender_psid = event.sender.id;
          if (event.message && event.message.text) {
            let response;
            let message = event.message.text.toLowerCase();
            if(/^(.*)chào|hi|hello|привет|здравствуйте|здравствуй(.*)$/.test(message)){
              let ans = ["Chào bạn! Bạn muốn học gì nào?  Gõ \"sẵn sàng\" để học nha!","Rất vui được gặp bạn!  Gõ \"sẵn sàng\" để học nha!","Bạn khỏe không?chúng ta bắt đầu bài học nha! Gõ \"sẵn sàng\" để học nha!"];
              response = {'text':ans[randomInteger(0,3)]};
            }else if(/^(.*)không biết|kb|k b|khong biet|là gì|не знаю(.*)$/.test(message)){
                let ans = ["Bạn không biết ư ! nó nghĩa là : ","Buồn quá -_-, nó có nghĩa là :","Từ này nghĩa là :"];
                response = {'text':ans[randomInteger(0,3)]};
              }else if(/^(.*)từ mới|слова|слово(.*)$/.test(message)){
                var group_words = JSON.parse(fs.readFileSync('./Data/group_words.json', 'utf8'));
                let array_group_words=[];
                group_words.data.forEach((val,i)=>{
                  
                    let item = {
                      "title": val.value,
                      "image_url":val.image,
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "Học từ mới",
                          "payload": "learn_"+val.key,
                        },
                        {
                            "type": "postback",
                            "title": "Kiểm tra từ mới",
                            "payload": "test_"+val.key,
                          },
                        {
                          "type": "postback",
                          "title": "Thoát",
                          "payload": "exit",
                        }
                      ],
                    };
        
                    array_group_words.push(item);
        
                })
                  response = {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": array_group_words
                      }
                    }
                  }
              }else if(/^(.*)giới thiệu|là ai|tên(.*)$/.test(message)){
                response = {'text':"Xin chào bạn tôi là bot chat ! Tôi được BaoLe_developer tạo ra giúp bạn học tiếng Nga tốt hơn."};

              }else if(/^(.*)sẵn sàng|san sang|menu(.*)$/.test(message)){
                response = {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "generic",
                      "elements": [{
                        "title": " ***** Cùng học tiếng Nga nào ! *****",
                        "subtitle": "Chào cậu tớ là chat bot học tiếng Nga. Bạn muốn học gì nà ? <baole-author>",
                        "image_url":"http://koreanhalong.edu.vn/data/media/1113/images/tieng-nga-giao-tiep-pns-corp-quang-ninh.jpg",
                        "buttons": [
                          {
                            "type": "postback",
                            "title": "Học từ mới",
                            "payload": "learn new words",
                          },
                          {
                              "type": "postback",
                              "title": "Kiểm tra ngữ pháp",
                              "payload": "test gramma",
                            },
                          {
                            "type": "postback",
                            "title": "Tôi là ai ?",
                            "payload": "who",
                          }
                        ],
                      }]
                    }
                  }
                }
              }
              if(response == null){
                let ans = ["Xin lỗi! Tôi không hiểu bạn muốn gì? hãy gõ \"menu\" để xem danh mục. ah mà đừng gõ luôn dấú \" nha :))","Xin lỗi! Tôi không hiểu? hãy gõ \"menu\" để xem danh mục. ah mà đừng gõ luôn dấú \" nha :))","Bạn biết đấy! tôi chỉ là con bot ngu ngốc,xin lỗi tôi không hiểu ý bạn ! hãy gõ \"menu\" để xem danh mục. ah mà đừng gõ luôn dấú \" nha :))"];
                response = {'text':ans[randomInteger(0,3)]};
              };
              
              sendMessage(sender_psid,response);
          } else if (event.postback) {
        
            handlePostback(sender_psid, event.postback);
          }
        });
      });
      res.status(200).end();
    }
  });
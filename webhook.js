const request = require('request');
var fs = require('fs');
function sendMessage(sender_psid,response) {
 
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: "EAAJio4hVMtMBAMDLLMZAtuuoPs8KNC7ZAJDz6dLAcAVQtR270DwZCKJeiq6wEkqu6dvQ9MH9Cm9w5vUoIujielp8sTrpsg7m41MMENJToYU7qOlceZBEZBkw0scr7lVk1c1ZA928T0iZCeXDeRVM4G5REsLG7SZBx5bq6NGKIbKinZC9LzDlD1AgNh33KiVtOIU8ZD"},
    method: 'POST',
    "json": request_body
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}

function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    switch (payload) {
        case 'learn new words':
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
           response = response = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": array_group_words
              }
            }
          }
           sendMessage(sender_psid, response);
            break;
        case 'who':
             response = {'text':"Xin chào bạn tôi là bot chat ! Tôi được BaoLe_developer tạo ra giúp bạn học tiếng Nga tốt hơn."}
             sendMessage(sender_psid, response);
             break;
        case 'test gramma':
             response = {'text':"Đang phát triển"}
             sendMessage(sender_psid, response);
             break;
        default:
        response = {'text':"Xin lỗi! Tính năng này đang phát triển..."}
        sendMessage(sender_psid, response);
            break;
    }
   
    
  }
module.exports.sendMessage = sendMessage;
module.exports.handlePostback = handlePostback;
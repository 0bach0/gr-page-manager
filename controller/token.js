var request = require('request');
exports.gettoken = ()=>{
    return new Promise(function(resolve,reject){

    var url = 'http://token-manager:3000/token';
    request(url, function (error, response, body) {
        console.log(error,response.statusCode);
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            resolve(body.message.access_token);
        }
        else{
            reject('Error in fetching token');
        }
    });
    });
}

exports.errortoken = (token)=>{
    var url = 'http://token-manager:3000/tokenerr';
    request.post(
        {   
            url:url,
            form:{ access_token: token }
        }, 
        function (error, response, body) {
            console.log(body);
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
            }
            else{
            }
    });
}
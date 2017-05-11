var Page = require('../models/page');
var token = require("./token")

exports.newpage= (req,res,next)=>{
    console.log('Received new page ',req.body);
    var checked = (!req.body.id) ? false : true;
    
    if(checked) {
        var id = req.body.id;
        
        Page.findOne({'id':id}, function (err,results){
            
            if(err){
                console.log(err);
                return;
            }
            if(results != null){
                var time_limit='';
                if (typeof req.body.time_limit === "undefined") {
                    time_limit = results.time_limit;
                }
                else{
                    time_limit = req.body.time_limit;
                }
                var last_update = '';
                if (typeof req.body.last_update === "undefined") {
                    last_update = results.last_update;
                }
                else{
                    last_update = req.body.last_update;
                }
                
                
                Page.update({'id':id},{'id':id,'name':results.name,'time_limit':time_limit,'last_update':last_update}).then((succ)=>{console.log(succ);},(succ)=>{console.log(succ);});
                res.send({status:'done',message:{info:'Updated '+id}});
            }
            else{
                var time_limit=req.body.time_limit;
                token.gettoken().then((access_token)=>{
                    var fburl = "https://graph.facebook.com/v2.8/"+id+"?access_token=" + access_token;
                    var request = require('request');
                    console.log(fburl);
                    request(fburl, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            body = JSON.parse(body);
                            console.log('time here',time_limit);
                            var page = new Page({'id':id,'name':body.name,'time_limit':time_limit,'last_update':time_limit});
                            console.log(page);
                            page.save().then((results)=>{
                                res.send({status:'done',message:{info:'Add new data '+id}});
                            }).catch((err)=>{
                                 console.log(err);
                                res.send({status:'error',message:{info:'Error need to be handled.'}});                
                            });
                        }
                        else{
                            if (body.indexOf('Session has expired') > -1) {
                                token.errortoken(access_token);
                            }
                            res.send({status:'error',message:{info:'Error need to be handled.'}});                
                        }
                    }
                );    
                }).catch((err)=>{
                    console.log(err);
                    res.send({status:'error',message:{info:'Error need to be handled.'}});
                });
                
            }
        });
        
        
    }
    else{
        res.send({status:'error',message:{info:'Required parameters.'}});
    }
    
    
}

exports.getpages = (req,res,next)=>{
    Page.find({}, function (err,results){
        if(err){
            res.send({status:'error',message:{info:'Error in db.'}});
            return;
        }
    
        var data = [];
        for(var x in results){
            var tmp = {};
            tmp.id = results[x].id;
            tmp.name = results[x].name;
            tmp.time_limit = results[x].time_limit;
            tmp.last_update = results[x].last_update;
            
            data.push(tmp);
        }
        console.log('Get pages ',data);
        res.send({status:'done',message:data});
    });
    
}

exports.deletepage = (req,res,next)=>{
    console.log('Delete page ',req.body);
    var checked = (!req.body.id) ? false : true;
    
    if(checked) {
        var id = req.body.id;
        Page.findOneAndRemove({id: id}, (err,results)=>{
            if(err){
                console.log(err);    
                res.send({status:'error',message:{info:'In delete.'}});
                return;
            }
            console.log(results);
            
            res.send({status:'done',message:{info:'Deleted '+id}});
        }
        );    
        
    }
    else{
        res.send({status:'error',message:{info:'Required parameters.'}});
    }
}

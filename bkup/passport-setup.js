var config = require('./server.config');
var ultilsSecurity=require('./utils/security')();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function processPassort(app){
    
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy.Strategy(function(username,password,done){

        //shortcut....requires no backend---for dev only
        if(config.devAuth.enable){
            if(username.toUpperCase() === config.devAuth.userName && password === config.devAuth.password){
            done(null, {id:1, username:config.devAuth.userName, email:''});
            }else{
            //no error i.e. did not authenticate
            done(null,null,{message:"Invalid username or password."});
            }
        } else {
            

            //get these from config or env variables
            var domain = config.apexAuth.winAuthDomain;
            var useAd = config.apexAuth.useAd;

            var url = '';
            if(useAd){
                url=config.apexAuth.winAuthEndPoint + '?username=' + username + '&password=' + password + '&domain=' + domain;
            } else {
                url=config.apexAuth.formsAuthEndPoint + '?username=' + username + '&password=' + password;
            }
            var gs=require('./utils/get-json');

            gs(url,function(status,result){

                if(result.IsValid===true){
                    //encrypt username+pwd+datetime as one string so we can send to client
                    //client can store encrypted string in localstorage and use after disconnect
                    var sobj = JSON.stringify({username:username, password:password, created:new Date()});
                    var secret = ultilsSecurity.encrypt(sobj);

                    if(result.hasOwnProperty('Roles')){                    
                        done(null, {username: result.Username, secret:secret, roles: result.Roles});
                    } else {
                        done(null, {username: result.Username, secret:secret, roles:[]});
                    }
                }else{
                    done(null,false,{message:"Invalid username or password."});
                }
            });
        }

    }));

    //the user we create in localStrategy constructor
    //will be passed to these two methods, at the moment that
    //user is actually authenticated by other systems
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    
    
}


module.exports = processPassort;
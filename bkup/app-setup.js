
function processAppSetup(app,server){
    var config=require('./server.config');
    
    var io = require('socket.io')(server);
    app.locals.io=io;

    //sets up the mongo context for access from any route which requires it
    //see aims/flight-data for usage examples
    var mongoContext=require('./routes/db/mongo/db-context')(config.mongodb.connectionString);
    var mongoModels=require('./routes/db/mongo/schema-factory')(mongoContext.getConnection());
    mongoContext.setModels(mongoModels);
    
    //a different way of passing socketio, however the updater method seems more stable
    var routes = require('./routes/index')(io);
    
    var users = require('./routes/users');
    var auth= require('./routes/auth');
    auth.setContext(mongoContext);
    
   //pass io to any requiring routes
}



module.exports = processAppSetup;
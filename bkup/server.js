var restify = require('restify');
var sql_select = require('./sql_select');
var statements = require('./statements');

var server = restify.createServer({
    name: 'xxx-data-api',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
restify.CORS.ALLOW_HEADERS.push('accept');
restify.CORS.ALLOW_HEADERS.push('sid');
restify.CORS.ALLOW_HEADERS.push('lang');
restify.CORS.ALLOW_HEADERS.push('origin');
restify.CORS.ALLOW_HEADERS.push('withcredentials');
restify.CORS.ALLOW_HEADERS.push('x-requested-with');
server.use(restify.CORS());

server.post('/api/category/resource/', function(req, res, next){
      
   res.send('ok');
});

server.get('/api/select/something', function (req, res, next) {
    sql_select('some statement', function (data) {
        res.send(data);
    }, function (err) {
        var errObj = {error: err};        
        res.send(errObj);
    });
});


// start server
server.listen(8061, "localhost", function () {
    console.log('%s listening at %s', server.name, server.url);
});


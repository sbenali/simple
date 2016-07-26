function processAppErrors(app){
    
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;

        res.render('404',{title:'Page not found.'});
    });

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('500', {
                message: err.message,
                error: err
            });
        });
    });
    
}

module.exports = processAppErrors;
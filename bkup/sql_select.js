/**
 * Created by sam.benali on 17/03/2016.
 */
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

module.exports = function(statement, cbSuccess, cbError){
    var results = [];
    var connection = new Connection({
        type: "SQLSERVER",
        userName: '',
        password: '',
        server: '',
        options: {
            database: ''
        }
    });

    console.log('About to connect to SQL Server');

    connection.on('connect', function(err)
    {
        if(err) {
            console.error("Error Connecting to APEX SQL: " + err);
            cbError(err);
        } else {
            console.log('Executing APEX SQL: ' + statement);
            var request = new Request(statement, function(err, rowCount){
                if(err){
                    console.error("Error executing APEX SQL: " + err);
                    cbError(err);
                }else{
                    console.log("APEX returned %d rows.", rowCount);
                    cbSuccess(results);
                }
            });

            //below works for kendo
            request.on('row', function(cols){
                var obj = {};
                cols.forEach(function(col){
                    obj[col.metadata.colName]=col.value;
                });
                results.push(obj);
            });

            connection.execSql(request);
        }
    });

};

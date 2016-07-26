var mongoose = require('mongoose');
var _ = require('lodash');


//DbContext is basically a wrapper around the mongoose API, 
//its main job is to maintain a connection and it is designed to be used by several
//endpoints if you want to change anything check out the docs on http://mongoosejs.com
//this class depends on the existence of a schema factory which can return valid mongoose
//schema objects

//usage: 
/*
    var context = require('./DbContext')({mongodb connection string})
    //require models and pass them the connection maintained by DbContext
    var models = require('./models/schema-factory')(context.getConnection());
    
    //important step: allows DbContext to get all models
    context.setModels(models);
    
    
*/

function DbContext(constr){
    
    var _connection;
    var all_models=[];
    _connection = mongoose.createConnection(constr,function(err){
        if(!err){
            console.log('CONNECTED TO MONGODB');
        }
    });            
    
    return {
        "getConnection":function(){
            return _connection;            
        },
        "setModels": function(models){
          all_models=models;  
        },
        "saveOne":function(modelName,modelData,cb){            
            var idx = _.findIndex(all_models,{name:modelName});               
            if(idx !== -1){
                var model=all_models[idx].model;
                var entityToSave = new model(modelData);
                if(entityToSave.hasOwnProperty("_id") === false || entityToSave._id.length === 0){
                    entityToSave._id=mongoose.Types.ObjectId();
                }
                entityToSave.save(function(err,result){
                    cb(err,result);
                });                
            }else{
                cb({message:'Invalid model index'},null);
            }
        },
        "saveMany":function(modelName,modelData,cb){
            var idx = _.findIndex(all_models,{name:modelName});                                     
            if(idx!==-1){
                var model=all_models[idx].model;
                model.insertMany(modelData,function(err, docs) {
                    cb(err,docs);    
                });
            }else{
                cb({message:'Invalid model index'},null);
            }
        },
        "findById":function(modelName,id,cb){
            var idx = _.findIndex(all_models,{name:modelName});               
            if(idx !== -1){
                var model=all_models[idx].model;
                model.find({_id:id},function(err,docs){
                    cb(err,docs);   
                });
            }else{
                cb({message:'Invalid model index'},null);
            }            
        },
        "findByQuery":function(modelName, qry, cb){
            var idx = _.findIndex(all_models,{name:modelName});                           
            if(idx !== -1){
                var model=all_models[idx].model;
                model.find(qry,function(err,docs){
                    cb(err,docs);
                });
            }else{
                cb({message:'Invalid model index'},null);
            }
        },
        "findByQueryWithProjection":function(modelName, qry, projection, cb){
            var idx = _.findIndex(all_models,{name:modelName});               
            if(idx !== -1){
                var model=all_models[idx].model;
                model.find(qry,projection,function(err,docs){
                    cb(err,docs);
                });
            }else{
                cb({message:'Invalid model index'},null);
            }
        },
        "removeById":function(modelName,id,cb){
            var idx = _.findIndex(all_models,{name:modelName});               
            if(idx !== -1){
                var model=all_models[idx].model;
                model.findOneAndRemove({_id:id},{},function(err,doc,result){
                    cb(err,doc,result);
                });    
            }else{
                cb({message:'Invalid model index'},null);
            }      
        },    
        "updateOneById":function(modelName,id,newModel,cb){
            var idx = _.findIndex(all_models,{name:modelName});               
            if(idx !== -1){
                var model=all_models[idx].model;
                model.update({_id:id},newModel,function(err,result){
                    cb(err,result);
                });   
            }else{
                cb({message:'Invalid model index'},null);
            }               
        }, 
        "updateOrInsert":function(qry, modelName, modelData, cb){
            var idx = _.findIndex(all_models,{name:modelName});                                                 
            if(idx !== -1){                
                var model=all_models[idx].model;
                //query must be for unique column e.g. username
                var entityToSave = new model(modelData);
                model.findOneAndUpdate(qry,entityToSave,{upsert:true},function(err, docs) {
                    cb(err,docs);
                });
            }else{
                cb({message:'Invalid model index'},null);
            }                        
        },
        "createObjectId":function(){
            return mongoose.Types.ObjectId();            
        }
    };    
    
}


module.exports = DbContext;
    
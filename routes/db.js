var mongo=require("mongodb");
var MongoClient = mongo.MongoClient;
var Urls = 'mongodb://localhost:27017/userMsg';
var assert = require('assert');


var settings = { 
  cookieSecret: 'myblog', 
  db: 'userMsg', 
  host: 'localhost',
  port: 27017
}; 



module.exports = function(collectionName,callback){
	MongoClient.connect(Urls,function(err,db){
		assert.equal(null, err);
		console.log("Connected correctly to server");
		db.collection(collectionName,function(err,collection){
			if(err){
				err= 'error ';
				db.close();
				return callback(err);
			}
			callback(collection,db);
		})
	})
}

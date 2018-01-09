//var mongo=require("mongodb");
//var MongoClient = mongo.MongoClient;
//var Urls = 'mongodb://localhost:27017/userMsg';
//var assert = require('assert');

var mongodb = require('./db.js');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.repassword = user.repassword;
}

module.exports = User;

User.prototype.save = function(callback){
	var users = {
		name: this.name ,
		password: this.password,
      	email: this.email
	}
	
	mongodb('users',function(collection,db){
		collection.insertMany([users],function(err,user){
//			console.log(user,'save 保存 成功')
			db.close();
			if(err){
				return callback(err);
			}
			callback(null,user);
		})
	});
//	MongoClient.connect(Urls,function(err,db){
//		assert.equal(null, err);
//		console.log("Connected correctly to server");
//		db.collection('users',function(err,collection){
//			if(err){
//				err= 'error ';
//				db.close();
//				return callback(err);
//			}
//			collection.insertMany([users],function(err,user){
//				console.log(user,'save 保存 成功')
//				db.close();
//				if(err){
//					return callback(err);
//				}
//				callback(null,user);
//			})
//		})
//	})
};

User.get = function(name,_callback){
	mongodb('users',function(collection,db){
		collection.findOne({
			name:name
		},function(err,user){
			db.close();
			if(err){
				err= 'not find';
				return _callback(err);
			}
			//console.log(user,'查询用名')
			_callback(null,user);
		})
	});
	
	
//	MongoClient.connect(Urls,function(err,db){
//		assert.equal(null, err);
//		console.log("Connected correctly to server");
//		db.collection('users',function(err,collection){
//			if(err){
//				err= 'error ';
//				db.close();
//				return _callback(err);
//			}
//			collection.findOne({
//				name:name
//			},function(err,user){
//				db.close();
//				if(err){
//					err= 'not find';
//					return _callback(err);
//				}
//				console.log(user,'查询用名')
//				_callback(null,user);
//			})
//		});
//	})
};

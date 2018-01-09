var mongodb = require('./db.js');

function Post(name,title,post){
	this.name = name;
	this.title = title;
	this.post = post;
}

module.exports = Post;

//存储一篇文章及其相关信息s
Post.prototype.save = function(callback){
	 var date = new Date();
  	//存储各种时间格式，方便以后扩展
  	var time = {
      	date: date,
      	year : date.getFullYear(),
      	month : date.getFullYear() + "-" + (date.getMonth() + 1),
      	day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      	minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      	date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  	}
  	//要存入数据库的文档
  	var post = {
      	name: this.name,
      	time: time,
      	title: this.title,
      	post: this.post
  	};
  	
  	mongodb('posts',function(collection,db){
		collection.insertMany([post],function(err,post){
			db.close();
			if(err){
				return callback(err);
			}
			callback(null,post);
		})
	});
}

//删除 一篇文章
Post.prototype.clear = function(callback){
	var post = {
      	name: this.name,
      	title: this.title
  	};
  	console.log(post,'clear  post丽丽的的')
  	mongodb('posts',function(collection,db){
		collection.remove(post,function(err,post){
			db.close();
			if(err){
				return callback(err);
			}
			callback(null,post);
		})
	});
}


//读取文章及其相关信息
Post.get = function(name, callback) {
	mongodb('posts',function(collection,db){
		var query = {};
      	if (name) {	
        	query.name = name;
      	}
		
      	//console.log(query,'query ')
		collection.find(query).sort({
			time:-1
		}).toArray(function(err,post){
			db.close();
			if(err){
				return callback(err);
			}
			callback(null,post);
		})
	});
}
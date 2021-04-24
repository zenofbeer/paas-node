var express = require('express');
var router = express.Router();
var config = require('../properties/settings.json');
var https = require('https');
var blogArticle = require('../public/javascripts/blogArticle');

/* GET home page. */
router.get('/', function(request, response, next) {
	var pageGet = {
		host : 'www.googleapis.com',
		port : 443,
		path : '/blogger/v3/blogs/' + config.blogs.ZenOfBeer.id + '/posts?key=' + config.keys.google,
		method : 'GET'
	};

	var requestGet = https.request(pageGet, function(res){
		res.setEncoding('utf-8');
		var responseString = '';
		res.on('data', function(chunk){
			responseString += chunk;
		});
		res.on('end', function(){
			var responseJson = JSON.parse(responseString);
			var displayPost = getParsedPost(getPost(responseJson, 0));
			var columnFirstPost = getParsedPost(getPost(responseJson, 1));
			var nextPost = getParsedPost(getPost(responseJson, 2));
			var lastPost = getParsedPost(getPost(responseJson, 3));
			var nextPageTokens = [];
			nextPageTokens.push(responseJson.nextPageToken);
			var pageArticles = [];
			for(var i = responseJson.items.length - 1; i >= 3; i--){
				pageArticles.push(responseJson.items[i]);
			}

			var pagePayload = {
				title : config.globalstrings.titlePaulChristensenNet,
				description : config.globalstrings.descriptionPaulChristensenNet,
				mainPostTitle : displayPost.title,
				mainPostContent : displayPost.content,
				columnFirstThumb : columnFirstPost.thumb,
				columnFirstTitle : columnFirstPost.title,
				columnFirstSummary : columnFirstPost.summary,
				columnFirstHidden : columnFirstPost.hidden,
				nextPostThumb : nextPost.thumb,
				nextPostTitle : nextPost.title,
				nextPostSummary : nextPost.summary,
				nextPostHidden : nextPost.hidden,
				lastPostThumb : lastPost.thumb,
				lastPostTitle : lastPost.title,
				lastPostSummary : lastPost.summary,
				lastPostHidden : lastPost.hidden,
				nextPageTokens : JSON.stringify(nextPageTokens),
				pageArticles : JSON.stringify(pageArticles)
			};

			response.render('./index', pagePayload);
		});
	});
	requestGet.end();
});

getParsedPost = function(post){
	if(post != null){
		var id = post.getArticleId();
		var publishedDate = post.getPublishedDate();
		return{
			title : post.getTitle(),
			content : post.getContent(),
			summary : post.getContentSummary(),
			thumb : post.getThumbnail(),
			id : id,
			navLink : '/' + id,
			publishedDate : publishedDate,
			hidden : ''
		}
	}
	else{
		return{
			title : '',
			content : '',
			summary : '',
			thumb : '',
			id : '',
			navLink : '',
			publishedDate : '',
			hidden : 'hidden=\"hidden\"'
		}
	}
};

getPost = function(posts, index){
	var post = blogArticle.blogArticle;
	if(index == undefined){
		post.init(posts);
	}
	else{
		var thisPost = posts['items'];
		if(thisPost != null){
			post.init(thisPost[index]);
		}
		else{
			return null;
		}
	}
	return post;
}

module.exports = router;

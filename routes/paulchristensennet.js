/**
 * Created by pachristensen on 8/3/2016.
 */
var config = require('../properties/settings.json');
var https = require('https');
var express = require('express');
var blogArticle = require('../public/javascripts/blogArticle');
var router = express.Router();

router.get('/:articleId/:previousArticleId', function(request, response, next){
	var articleId = request.params.articleId;
    var previousArticleId = request.params.previousArticleId;
	var targetoptionsget = {
		host : 'www.googleapis.com',
		port : 443,
		path : '/blogger/v3/blogs/2431897220898914062/posts/' + articleId + '?key=' + config.keys.google,
		method : 'GET'
	};


	var renderPage = https.request(targetoptionsget, function(res){
		res.setEncoding('utf-8');
		var responseString = '';
		res.on('data', function(chunk){
			responseString += chunk;
		});
		res.on('end', function(){
			var responseJson = JSON.parse(responseString);
			var article = getArticle(responseJson);
			var currentArticle = getParsedArticle(article);
			currentArticle.previousArticleId = previousArticleId;

            var previousArticleOptionsGet = {
                host : 'www.googleapis.com',
                port : 443,
                path : '/blogger/v3/blogs/2431897220898914062/posts/' + previousArticleId + '?key=' + config.keys.google
            };

			var nextArticlesOptionsGet = {
				host : 'www.googleapis.com',
				port : 443,
				path : '/blogger/v3/blogs/2431897220898914062/posts?key=' + config.keys.google + '&maxResults=2&endDate=' + currentArticle.publishedDate.toISOString()
			};

			var getPreviousArticle = https.request(previousArticleOptionsGet, function(pres){
				pres.setEncoding('utf-8');
				var presponseString = '';
				pres.on('data', function(chunk){
					presponseString += chunk;
				});
				pres.on('end', function(){
					var presponseJson = JSON.parse(presponseString);
					var particle = getArticle(presponseJson);
					var previousArticle = getParsedArticle(particle);
					previousArticle.previousArticleId = 0;

					var getNextArticles = https.request(nextArticlesOptionsGet, function(nres){
						nres.setEncoding('utf-8');
						var nresponseString = '';
						nres.on('data', function (chunk) {
							nresponseString += chunk;
						});
						nres.on('end', function(){
							var nresponseJson = JSON.parse(nresponseString);

							response.render('./paulchristensennet/index', getArticleRenderObject([
								currentArticle, previousArticle, getParsedArticle(getArticle(nresponseJson, 0)),
								getParsedArticle(getArticle(nresponseJson, 1))
							]));
						});
					});
					getNextArticles.end();
				});
			});
			getPreviousArticle.end();
			/*var getNextArticles = https.request(nextArticlesOptionsGet, function(nres){
				nres.setEncoding('utf-8');
				var nresponseString = '';
				nres.on('data', function(chunk){
					nresponseString += chunk;
				});
				nres.on('end', function(){
					var nresponseJson = JSON.parse(nresponseString);

					response.render('./paulchristensennet/index', getArticleRenderObject([
						currentArticle, getParsedArticle(getArticle(nresponseJson, 0)),
						getParsedArticle(getArticle(nresponseJson, 1)), getParsedArticle(getArticle(nresponseJson, 2))
					]));
				});
			});
			getNextArticles.end();*/
		});
	});
	renderPage.end();
});

// Home landing
router.get('/', function(request, response, next){
	var optionsget = {
		host : 'www.googleapis.com',
		port : 443,
		path : '/blogger/v3/blogs/2431897220898914062/posts?key='+config.keys.google+'&maxResults=3',
		method : 'GET'
	};
	renderHomePage(optionsget, response);
});

getArticle = function(articles, index){
	var article = blogArticle.blogArticle;
	if(index == undefined){
		article.init(articles);
	}else {
		var thisArticle = articles['items'];
		if(thisArticle != null){
			article.init(thisArticle[index]);
		}
		else{
			return null;
		}
	}
	return article;
};

getParsedArticle = function(article){
	if(article != null) {
		var id = article.getArticleId();
		var publishedDate = article.getPublishedDate();
		return {
			title: article.getTitle(),
			content: article.getContent(),
			summary: article.getContentSummary(),
			thumb: article.getThumbnail(),
			id: id,
			navLink: '/paulchristensennet/' + id,
			publishedDate: publishedDate,
			nextSearchDate: getNextSearchDate(publishedDate),
            previousArticleId: ''
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
			nextSearchDate : '',
            previousArticleId: ''
		};
	}
};

getNextSearchDate = function(publishedDate){
	var searchDate = new Date(publishedDate.toISOString());
	searchDate.setTime(publishedDate.getTime() - 1000);
	return searchDate;
};

renderHomePage = function(optionsget, response){
	var requestGet = https.request(optionsget, function(res){
		res.setEncoding('utf-8');
		var responseString = '';
		res.on('data', function(chunk){
			responseString += chunk;
		});
		res.on('end', function(){
			var responseJson = JSON.parse(responseString);
            var displayArticle = getParsedArticle(getArticle(responseJson, 0));
            displayArticle.previousArticleId = 0;
            var previousArticle = getParsedArticle();
            previousArticle.previousArticleId = 0;
            var nextArticle = getParsedArticle(getArticle(responseJson, 1));
            nextArticle.previousArticleId = displayArticle.id;
            var lastArticle = getParsedArticle(getArticle(responseJson, 2));
            lastArticle.previousArticleId = nextArticle.id;

			response.render('./paulchristensennet/index', getArticleRenderObject([
			    displayArticle, previousArticle, nextArticle, lastArticle
			]));
		});
	});
	requestGet.end();
};

getArticleRenderObject = function(articles){
	return{
		bloghomelink : './',
		title : config.globalstrings.titlePaulChristensenNet,
		description : config.globalstrings.descriptionPaulChristensenNet,
		mainTitle : articles[0].title,
		mainContent : articles[0].content,
		columnFirstThumb : articles[1].thumb,
		columnFirstTitle : articles[1].title,
		columnFirstSummary : articles[1].summary,
		columnFirstNavlink : articles[1].navLink,
        columnFirstPreviousId : articles[1].previousArticleId,
		columnSecondThumb : articles[2].thumb,
		columnSecondTitle : articles[2].title,
		columnSecondSummary : articles[2].summary,
		columnSecondNavlink : articles[2].navLink,
        columnSecondPreviousId : articles[2].previousArticleId,
		columnThirdThumb : articles[3].thumb,
		columnThirdTitle : articles[3].title,
		columnThirdSummary : articles[3].summary,
		columnThirdNavlink : articles[3].navLink,
        columnThirdPreviousId : articles[3].previousArticleId
	};
};

module.exports = router;
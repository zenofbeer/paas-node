/**
 * Created by pachristensen on 3/4/2016.
 */
var https = require('https');
var express = require('express');
var bloghandler = require('../public/javascripts/bloghandler');
var router = express.Router();

/* Get Home Page */
router.get('/', function(req, res, next){
    res.render('index',
        {
            title:'Blogger service docs',
            description:'The Blogger service documentation'
        }
    );
});

router.get('/blog/:blogId', function(req, res, next){
    var blogId = req.params.blogId;
    res.send(blogId);
});

router.get('/v3/blogs/:blogId/allposts', function(request, response, next){
    var handler = bloghandler.bloggerHandler;
    var blogId = request.params.blogId;
    var apiKey = request.query['key'];
    var result;
    //response.send(handler.Init(blogId, apiKey, result));
    //response.send(callApi);
    //response.render('index',
    //    {
    //        title:'a title here',
    //        description: 'my description here'
    //    });
    callApi();

    function callApi(){
        var optionsget = {
            host : 'www.googleapis.com',
            port : 443,
            path : '/blogger/v3/blogs/2431897220898914062/posts?key=AIzaSyCqfuDVPAhdwyu-KYoToNbu6NN5Vp3M3fs&maxResults=1',
            method : 'GET'
        };

        var reqGet = https.request(optionsget, function(res){
            // http://isolasoftware.it/2012/05/28/call-rest-api-with-node-js/
            res.setEncoding('utf-8');
            var responseString = "";
            res.on('data', function(d){
                responseString += d;
            });
            res.on('end', function(){
                var responseJson = JSON.parse(responseString);
                var articles = responseJson['items'];
                var article = articles[0];
                var articleTitle = article['title'];

                response.render('index', {
                    articletitle : articleTitle
                });
            });
        });
        reqGet.end();
    }

});


//https://www.googleapis.com/blogger/v3/blogs/2431897220898914062/posts?key=AIzaSyCqfuDVPAhdwyu-KYoToNbu6NN5Vp3M3fs

module.exports = router;
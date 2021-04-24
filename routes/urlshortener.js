/**
 * Created by Paul on 3/26/2016.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../properties/settings.json');

/* Default landing page for the URL shortener */
router.get('/', function(req, res, next){
   res.render('urlshortener',
       {
           description: 'URL Shortener',
           usagehead: 'Usage',
           usage :[
               {
                   label : 'Result Only:',
                   api : 'http://localhost:3000/urlshortener/shorten?url=<url>'
               },
               {
                   label : 'Full Response:',
                   api : 'http://localhost:3000/urlshortener/shorten/fullresponse?url=<url>'
               }
           ]
       });
});

/* POST a URL to create a short URL */
router.get('/shorten/', function(req, res, next){
    var longUrl = req.query['url'];
    var postUrl = config.apis.googleShortenerV1 + '?key=' + config.keys.google;
    request.post(
        postUrl,
        {
            json: {longUrl:longUrl}
        },
        function(error, response, body){
            if(!error && response.statusCode == 200){
                var shortUrl = body.id;
                
                res.render('urlshortener', {
                    description : 'Your Short URL',
                    simpleresponse : true,
                    label : 'Short URL',
                    shorturl : shortUrl
                });
            }
        }
    );
});

/* POST a URL to create a short URL, and retrieve the full response */
router.get('/shorten/fullresponse/', function(req, res, next){
    var longUrl = req.query['url'];
    var postUrl = config.apis.googleShortenerV1 + '?key=' + config.keys.google;
    request.post(
        postUrl,
        {
            json:{longUrl:longUrl}
        },
        function(error, response, body){
            var longUrl = body.longUrl;
            var shortUrl = body.id;

            if(!error && response.statusCode == 200){
                res.render('urlshortener',{
                    description : 'Your Response',
                    fullresponse : true,
                    longlabel : "Source URL",
                    longurl : longUrl,
                    shortlabel : 'Shortened URL',
                    shorturl : shortUrl
                });
            }
        }
    )
});

module.exports = router;
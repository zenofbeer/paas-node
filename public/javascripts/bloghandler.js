/**
 * Created by pachristensen on 3/4/2016.
 */
var https = require('https');

var bloggerHandler = (function(){
    var
        baseUri = "https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts?key={apiKey}",
        setBlogId = function(blogId){
            baseUri = baseUri.replace('{blogId}', blogId);
        },
        setApiKey = function(apiKey){
            baseUri = baseUri.replace('{apiKey}', apiKey);
        },
        callApi = function(result){
            var optionsget = {
                host : 'www.googleapis.com',
                port : 443,
                path : '/blogger/v3/blogs/2431897220898914062/posts?key=AIzaSyCqfuDVPAhdwyu-KYoToNbu6NN5Vp3M3fs',
                method : 'GET'
            };

            // go the request
            var reqGet = https.request(optionsget, function(res){
                // http://isolasoftware.it/2012/05/28/call-rest-api-with-node-js/
                res.on('data', function(d){
                   var x = d;

                    for(var i = 0; i < x.length - 1; i++){
                        result += String.fromCharCode(x[i]);
                    }
                });
            });
            reqGet.end();
            reqGet.on('error', function(e){
               // deal with the error.
            });
        },
        init = function(blogId, apiKey, result){
            setBlogId(blogId);
            setApiKey(apiKey);
            callApi(result);
        };
    return {
        Init : init
    }
})();

exports.bloggerHandler = bloggerHandler;
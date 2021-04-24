/**
 * Created by pachristensen on 8/5/2016.
 */
var htmlparser = require('htmlparser2');

var blogArticle = (function(){
    var rawArticle,

	    getTitle = function(){
	        return rawArticle['title'];
	    },
	    getContent = function(){
	        return rawArticle['content'];
	    },
		getContentSummary = function(){
	        return getContent().replace(/<(.|\n)*?>/g, ' ').substr(0, 139) + '...';
		},
	    getArticleId = function(){
			return rawArticle['id'];
	    },
	    getThumbnail = function(){
	        var content = getContent();
		    var imgTag = content.match(/<img([\w\W]+?)\/>/);
		    if(imgTag != null) {
			    var imgUrl = imgTag[0].match(/\b(http(s)*\:\/\/)[a-zA-Z0-9\S.\/]+\b/);
			    if(imgUrl != null){
				    return imgUrl[0];
			    }

		    }
		    return '';
	    },
	    getPublishedDate = function(){
	    	var publishedDate = new Date(rawArticle['published']);
		    return publishedDate;
	    },
	    init = function(article){
	        rawArticle = article;
	    };
    return{
        init : init,
        getTitle : getTitle,
        getContent : getContent,
	    getContentSummary : getContentSummary,
	    getThumbnail : getThumbnail,
	    getArticleId : getArticleId,
	    getPublishedDate : getPublishedDate
    };
})();

exports.blogArticle = blogArticle;
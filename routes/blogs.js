/**
 * Created by Paul on 3/4/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/blogs', function(request, response, next){
    response.send('The default page for blogs')
});

module.exports = router;
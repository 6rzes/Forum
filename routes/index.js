var express = require('express');
var router = express.Router();
var google = require('google');


// var js = require('jsearch');
var searchedResults;

/* GET home page. */
router.get('/', function (req, res, next) {
    //
    // // js.google(req.query.search,25,function(response){
    // //   searchedResults = response;
    // //   // console.log(response); // Show the links for 10 pages on Google
    // // });
    //
    // google.resultsPerPage = 25;
    // var nextCounter = 0;
    // google(req.query.search, function (err, res) {
    //     searchedResults = res.links;
    // });

    res.render('index', {
        title: 'Google Search',
        results: searchedResults
    });
});

module.exports = router;


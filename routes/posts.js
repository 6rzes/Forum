var express = require('express');
var router = express.Router();
// var postsJSON = require('../posts.json');
var postsJSON = require('../posts.json');
var commentsJSON = require('../comments.json');
var requestJSON = require('request');
var urlPostsJSON = 'https://jsonplaceholder.typicode.com/posts/?userId=';
var urlCommentsJSON = 'https://jsonplaceholder.typicode.com/comments/?postId=';
var resultsPerPage = 4;
var currentUser=1;
var currentPage=1;

/* GET home page. */
router.get('/', function (req, res, next) {

    if (req.query.userId) {
        currentUser=req.query.userId;
    }

    if (req.query.pagination) {
        currentPage=req.query.pagination;
    }
    var promises = [];
    var results = [];
    var page = currentPage;

    function parseData() {
        console.log("parse data");
        res.render('posts', {
            title: 'Posts',
            posts: results,
            currentUser: currentUser,
            currentPage: currentPage,
        });
    }

    function postWithComments(post, comments) {
        this.post = post;
        this.comments = comments;
    }

    function getCommentsForPosts(filteredPosts) {
        if (filteredPosts == 0) {
            parseData();
        }

        filteredPosts.forEach(function (post) {
            var p = new Promise(function (resolve, reject) {
                requestJSON(
                    {
                        url: urlCommentsJSON + post.id,
                        json: true
                    }, function (err, res, json) {
                        if (err) {
                            throw err;
                        }
                        results.push(new postWithComments(post, json));
                        resolve();
                    });
            });
            promises.push(p);
        });

        Promise.all(promises).then(function (details) {
            parseData();
        });
    }

    function getPosts() {

        return requestJSON(
            {
                url: urlPostsJSON + req.query.userId,
                json: true
            }, function (err, res, json) {
                if (err) {
                    throw err;
                }
                console.log("page: " + page);
                var resultsNo = json.length;
                var start = (page - 1) * resultsPerPage;
                var end = (page) * resultsPerPage;
                if (end > json.length) {
                    end = json.length;
                }
                console.log("start: " + start);
                console.log("end:   " + end);
                return getCommentsForPosts(json.slice((page - 1) * resultsPerPage, (page) * resultsPerPage));
            });
    }

    getPosts();
});


module.exports = router;


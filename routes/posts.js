var express = require('express');
var router = express.Router();
var requestJSON = require('request');
var urlPostsJSON = 'https://jsonplaceholder.typicode.com/posts/?userId=';
var urlCommentsJSON = 'https://jsonplaceholder.typicode.com/comments/?postId=';
var resultsPerPage = 4;
var currentUser=1;
var currentPage=1;

/* GET home page. */
router.get('/', function (req, res) {

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
            var p = new Promise(function (resolve) {
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

        Promise.all(promises).then(function () {
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
                var start = (page - 1) * resultsPerPage;
                var end = (page) * resultsPerPage;
                if (end > json.length) {
                    end = json.length;
                }
                return getCommentsForPosts(json.slice(start, end));
            });
    }
    getPosts();
});


module.exports = router;


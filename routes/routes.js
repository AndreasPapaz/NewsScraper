var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var randomstring = require("randomstring");
var Article = require("./../models/Article.js");

router.get("/scrape", function(req, res) {

	scrapper();

	function scrapper() {
		
		var promises = [];

		request("https://www.reddit.com/r/germanshepherds/", function(err, res, html) {

			//load the HTML in the Cheerio selector commands
			var $ = cheerio.load(html);
			var res = [];

			//cheerio will allow me to grab p-tag with the "title" class (i: iterator. element: the current element)
			$("div.thing").each(function(i, element) {

				// var title = $(element).children("p.title").children("a").text();
				var title = $(element).children("div.entry").children("p.title").children("a").text();
				// var link = $(element).children("ul.flat-list").children("li.first").children("a").attr("href");
				var link = $(element).children("div.entry").children("ul.flat-list").children("li.first").children("a").attr("href");
				// var img = $(element).children("a.thumbnail").children("img").attr("href");
				var img = $(element).children("a").attr("href");

				var article = {
					"title": title,
					"link": link,
					"img": img
				};

				res.push(article);

			});
				console.log(res); 
				for (var i = 0; i < res.length; i++) {
					promises.push(dbPush(res[i]));
				}
		});
	}
});

router.get("/saved", function(req, res) {
	Article.find({"saved": true}).sort("-time").exec(function(err, article) {
		if (err) {
			console.log("error from saved " + err);
		} else {
			res.render("saved.handlebars", {articles: article});
		}
	});
});

router.get("/saved/comments/:id", function(req, res) {
	Article.find({ "_id": req.params.id }, function(err, articles) {
		if (err) {
			console.log("err from comments " + err);
		} else {
			res.render("comments.handlebars", { 
				articles: articles,
				comments: articles[0].comments
			});
		}
	});
});

router.put("/add/article", function(req, res) {
	Article.update({_id: req.body.id}, {$set: {saved: true}}, function(err, status) {
		if (err) {
			res.send("fail");
		} else {
			res.send("pass");
		}
	});
});

router.get("/", function(req, res) {
	Article.find().sort("-time").exec(function(err, article) {
		if (err) {
			console.log("Error from routes " + err);
		}
		else {
			res.render("scrape.handlebars", { articles: article });
		}
	});
});

router.put("/saved/remove_article", function(req, res) {
	Article.update({ _id: req.body.id }, { $set: { saved: false }}, function(err, status) {
		if (err) {
			res.send("fail");
		} else {
			res.send("pass");
		}
	});
});

router.put("/saved/post_comment", function(req, res) {
	var comment = {
		"articleId": req.body.id,
		"commentId": randomstring.generate(),
		"author": req.body.author,
		"comment": req.body.comment
	};
	Article.update({ _id: req.body.id }, { $push: {comments: comment}}, function(err, status) {
		if (err) {
			// res.send("fail");
			console.log("err from comment " + err);
		} else {
			res.send("pass");
		}
	});
});

router.put("/saved/delete_comment", function(req, res) {
	Article.update({ _id: req.body.articleId }, { $pull: {"comments": {commentId: req.body.commentId }}}, function(err, status) {
		if (err) {
			res.send("fail");
		} else {
			res.send("pass");
		}
	});
});

function dbPush(article) {

	return new Promise(function(resolve, reject) {

		if (article.title !== "") {
			
			var newArticle = new Article({
				title: article.title,
				link: article.link,
				img: article.img,
				comments: [],
				saved: false
			});

			Article.find({ title: newArticle.title }, function(err, article) {
				if (article.length != 1) {
					newArticle.save(function(err, article) {
						if (err) {
							console.log(err);
						}
						else {
							resolve();
						}
					});
				}
				else {
					resolve();
				}
			});
		}
		else {
			resolve();
		}

	});

}

module.exports = router;
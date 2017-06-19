var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	title: {
		type: String,
		require: true
	},
	excerpt: String,
	link: String,
	photoLink: String,
	comments: [],
	saved: Boolean,
	time: { 
		type: Date,
		default: Date.now
	}
});

var ArticleSchema = mongoose.model('Article', ArticleSchema);

module.exports = ArticleSchema;
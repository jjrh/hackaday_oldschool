var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

var FeedParser = require('feedparser')
var request = require('request');


function get_posts(res,page_id){
    var posts = []
    var req = request('http://hackaday.com/blog/feed/?paged='+page_id)
    , feedparser = new FeedParser();

    req.on('error', function (error) {
	// handle any request errors
    });
    req.on('response', function (res) {
	var stream = this;

	if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

	stream.pipe(feedparser);
    });


    feedparser.on('error', function(error) {
	// always handle errors
    });
    feedparser.on('readable', function() {
	// This is where the action is!
	var stream = this
	, meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
	, item;

	while (item = stream.read()) {
	    console.log(item);
//	    console.log(item['rss:description']);
	    posts.push(item) //['rss:description']);
	}
    });

    feedparser.on('end', function(){
	res.render('index', {title: 'hackaday_retro',posts:posts, page_next:parseInt(page_id)+1, page_prev:parseInt(page_id)-1 })
    })

}


router.route('/:id').get(function(req, res) {
    console.log("ID:", req.params.id);
    get_posts(res,req.params.id);
  // res.render('index', { title: 'Express',posts:{} });
});

module.exports = router;

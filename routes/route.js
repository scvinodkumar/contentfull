var contentful = require('contentful')
var util = require('util')

// Create agent
var request = require('contentful-agent')({
  space: 'nnbpv4hl3rxq',
  accessToken: '0c830ced9d19a6a361ab83fbdde2330636f35516e7eeabbe0c6859e1019ac889'
});

function get_cateogry_list() {
	var promise_cat = request.get({ cats: 'category' });
	
	promise_cat.then(function(entries){
		//console.log(entries.cats);
		//console.log(util.inspect(entries.cats, {showHidden: false, depth: null}));
		return entries.cats;
	});
}

exports.index=function(req,res){
	var promise = request.get({ products: 'products', categories: 'category' });	
	
	promise.then(function(entries){		
		res.render('index',{products:entries.products, categories:entries.categories});    		
	});	
}

exports.products=function(req,res){
	
	//console.log("coming...");
	
	// Get all entries with content type 63k4qdEi9aI8IQUGaYGg4O
	// and store them as cats in the response
	var promise = request.get({ products: 'products', categories: 'category' });	
	
	promise.then(function(entries){
		//console.log(entries.cats);		
		//console.log(util.inspect(entries.cats, {showHidden: false, depth: null}));
		res.render('index',{products:entries.products, categories:entries.categories});    		
	});	
	//console.log(get_cateogry_list());
	//res.render('index',{products:product_list});    
}

exports.articles=function(req,res){
	
	console.log("coming...");
	
	// Get all entries with content type 63k4qdEi9aI8IQUGaYGg4O
	// and store them as cats in the response
	var promise = request.get({ cats: 'articles' });
	
	promise.then(function(entries){
		//console.log(JSON.stringify(entries.cats));
		//console.log(util.inspect(entries.cats, {showHidden: false, depth: null}));
		res.render('article',{article:entries.cats});
	});	    
}

exports.view=function(req,res){
	var id=req.params.id;
	//console.log(url);
	promise = request.get({
	  cats: {
		id: 'products',
		filters: {
		  'sys.id[in]': [id]
		}
	  },
	  categories: 'category'
	});
	
	promise.then(function(entries){
		console.log(entries.cats);
		//console.log(util.inspect(entries.cats, {showHidden: false, depth: null}));
		res.render('view',{products:entries.cats, categories:entries.categories});
	});
}

exports.category_view=function(req,res){
	var id=req.params.id;
	//console.log(url);
	promise = request.get({
	  products: {
		id: 'products',
		filters: {
		  'fields.category.sys.id[in]': [id]
		}
	  },
	  categories: 'category'
	});
	
	promise.then(function(entries){
		//console.log(entries.cats);
		//console.log(util.inspect(entries.cats, {showHidden: false, depth: null}));
		res.render('index',{products:entries.products, categories:entries.categories});
	});
}

//var contentful = require('contentful');
var util = require('util');
var express=require('express');
var pagination = require('pagination');
var contentful_management = require('contentful-management');
var fs = require('fs');
//var fileupload = require('express-fileupload');
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('connect-flash');

var upload = multer({ dest: 'images/'});


// Create agent for contentful
var request = require('contentful-agent')({
  space: 'nnbpv4hl3rxq',
  accessToken: '0c830ced9d19a6a361ab83fbdde2330636f35516e7eeabbe0c6859e1019ac889'
});

// Create agent for contentful management
 var client = contentful_management.createClient({
  // This is the access token for this space. Normally you get the token in the Contentful web app
  accessToken: 'CFPAT-583c91fd046acbe1d2a67e60c7c53bfa34c8143ff2ce0aa222a8dfd7b7562716'
})

/*
	var filePath = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvJ7CFkxxcn3ryht-igi0MbmzfhHpWEz8hpxZXD_RlXM5aziCc';
	var fileName = 'uploadphoto.jpg';
	var contentType = 'application/octet-stream';
	
	
	client.getSpace('nnbpv4hl3rxq').then((space) => {				
			console.log('creating asset...');
			return space.createAsset({
				fields: {
					title: {
						'en-US': fileName
					},
					file: {
						'en-US': {
							fileName: fileName,
							contentType: 'image/jpg',
							upload:	filePath						
						}		
					}
				}
			})
			.then((asset) => {
				console.log('prcessing...');
				//console.log("Image ID:"+upload.sys.id);
				//console.log("Image Id assets:"+asset.sys.id);
				return asset.processForLocale('en-US', { processingCheckWait: 2000 });
			})
			.then((asset) => {
				console.log('publishing...');
				return asset.publish();
			})
			.then((asset) => {
				console.log(asset);
				return asset;
			})	
	});

	*/
	
/*

const client = contentful.createClient({
  space: 'nnbpv4hl3rxq',
  accessToken: '0c830ced9d19a6a361ab83fbdde2330636f35516e7eeabbe0c6859e1019ac889'
});

var ass = client.getAsset('5sMYGTN3c4UqsyumAqeSmI',{fit:'thumb',w:'100',h:'100'});
	ass.then(function(entries){	
		console.log(entries.fields.file.url);
	});	

*/



exports.index=function(req,res){
	
	//console.log("Authenitication:"+req.isAuthenticated());
	//console.log(req.user.facebook.gender);
	
	var currentPage = 1;
	var skip = 0;
	if (typeof req.query.page !== 'undefined') {
		currentPage = +req.query.page;
		skip = (currentPage - 1) * 5;
	}
	
	//var asst = request.asset('5sMYGTN3c4UqsyumAqeSmI');
	
	var promise = request.get({ totprods: 'products', 
								products: { 
									id: 'products', 
									filters: { 
										order: '-sys.createdAt',
										skip: skip, 
										limit: 6 
									}
								}, 
								categories: 'category', 
								banners: 'banners'	
							});

	promise.then(function(entries){	
		//console.log(entries.totprods.length);	
		res.render('index',{
							products:entries.products, 
							categories:entries.categories,
							banners:entries.banners,
							pager:pager_content('/',currentPage,6,entries.totprods.length,false),
							viewPage:0,
							expressFlash: req.flash('message')
						   });    		
	});	
}

exports.products=function(req,res){	
	
	// Get all entries with content type 63k4qdEi9aI8IQUGaYGg4O
	// and store them as cats in the response
	var promise = request.get({ products: 'products', categories: 'category' });
	
	promise.then(function(entries){		
		res.render('content',{products:entries.products, categories:entries.categories, expressFlash: req.flash('message')});    		
	});		
}

exports.articles=function(req,res){
	
	console.log("coming...");
	
	// Get all entries with content type 63k4qdEi9aI8IQUGaYGg4O
	// and store them as cats in the response
	var promise = request.get({ cats: 'articles' });
	
	promise.then(function(entries){
		//console.log(JSON.stringify(entries.cats));
		//console.log(util.inspect(entries.cats, {showHidden: false, depth: null}));
		res.render('content',{article:entries.cats,expressFlash: req.flash('message')});
	});	    
}

exports.view=function(req,res){
	var id=req.params.id;
	
	promise = request.get({
	  cats: {
		id: 'products',
		filters: {
		  'sys.id[in]': [id]
		}
	  },
	  categories: 'category',
	  comments: {
		id: 'comments',
		filters: {
		  'fields.contentId.sys.id[in]':id
		}
	  }
	});
	
	promise.then(function(entries){
		res.render('view',{
							products:entries.cats, 
							categories:entries.categories, 
							category:entries.cats[0].fields.category[0], 
							viewPage:1,
							comments:entries.comments,
							expressFlash: req.flash('message')
						  });
	});
}

exports.category_view=function(req,res){
	var id=req.params.id;

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
		var category = entries.categories.find(find_category_name,id);		
		res.render('content',{
								products:entries.products, 
								categories:entries.categories, 
								category:category, 
								viewPage:0,
								expressFlash: req.flash('message') 
							 });
	});
}

exports.search=function(req,res) {
	var term=req.body.search;
	if(term) {
		var promise = request.get({ 
			products: {
				id: 'products',				
				filters: {
					'fields.product_title[match]': [term],
					order: '-sys.createdAt'
				}
			},
			categories: 'category'
			});
	} else {		
		term = '';
		var promise = request.get({ categories: 'category' });
	}
	
	promise.then(function(entries){		
		if(term) {
			res.render('search',{
									categories:entries.categories,
									products:entries.products,
									term:term, 
									category:'', 
									viewPage:2,
									expressFlash: req.flash('message')
								});    		
		} else {
			res.render('search',{
									categories:entries.categories,
									products:'',
									term:term,
									category:'', 
									viewPage:2,
									expressFlash: req.flash('message')
								});    		
		}
	});
}


function pager_content(prelink = '/', current = 1, rows, total, slash = false) {
	var boostrapPaginator = new pagination.TemplatePaginator({
		prelink: prelink, 
		current: current, 
		rowsPerPage: rows,
		totalResult: total, 
		slashSeparator: slash,
		template: function(result) {
			var i, len, prelink;
			var html = '<div><ul class="pagination">';
			if(result.pageCount < 2) {
				html += '</ul></div>';
				return html;
			}
			prelink = this.preparePreLink(result.prelink);
			if(result.previous) {
				html += '<li><a href="' + prelink + result.previous + '">' + this.options.translator('PREVIOUS') + '</a></li>';
			}
			if(result.range.length) {
				for( i = 0, len = result.range.length; i < len; i++) {
					if(result.range[i] === result.current) {
						html += '<li class="active"><a href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
					} else {
						html += '<li><a href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
					}
				}
			}
			if(result.next) {
				html += '<li><a href="' + prelink + result.next + '" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
			}
			html += '</ul></div>';
			return html;
		}
	});

	return boostrapPaginator.render();
}


exports.savecomment=function(req,res){
   var id=req.params.id;
   var comment=req.body.comment;
 //  var posted_date=new Date();
 
	client.getSpace('nnbpv4hl3rxq')	
	.then((space) => space.createEntry('comments', {
			fields: {
				"comments": {
					'en-US': comment
				},
				"owner": {
					"en-US" : "Vinodkumar"
				},
				"contentId": {
					"en-US": {
						"sys": {
							"type": "Link",
							"linkType": "Entry",
							"id": id
						}
				    }
				}
			}
	}))
	.then((comment) => comment.publish())
	.then((comment) => res.redirect("/view/"+id))
	.catch(console.error); 
 }

function find_category_name(element, index, array) {
	//console.log("Category:"+this);
	if(element.sys.id == this) {
		//console.log(element.fields.title);
		return element.fields.title;
	}
}

exports.register=function(req,res){
	var promise = request.get({ categories: 'category' });
	//req.flash("messages", "Sign Up Success");
	//req.flash('success', 'This is a flash message using the express-flash module.');
	
	promise.then(function(entries){		
		res.render('register',{
							categories:entries.categories,
							viewPage:3,
							category:'',
							expressFlash: req.flash('message')
						  });	
	});
}

exports.registerSubmit=function(req,res,next) {
	
	//console.log(req.body);
	//console.log(req.file);
	var contentType = 'application/octet-stream';
	
	//upload.single('picture');
	//console.log(req.file);
	
	var file = __dirname + '/' + req.file.originalname;
	/*
	fs.rename(req.file.path, file, function(err) {
		if (err) {
		  console.log(err);
		  res.send(500);
		} else {
		  res.json({
			message: 'File uploaded successfully',
			filename: req.file.originalname
		  });
		}
	});
	*/
	
	var filePath = req.file.path;
	var fileName = req.file.originalname;

	
	client.getSpace('nnbpv4hl3rxq').then((space) => {
		console.log('uploading...');
		return space.createUpload({
			file: fs.readFileSync(filePath),
			contentType,
			fileName
		})
		.then((upload) => {
			console.log('creating asset...');
			return space.createAsset({
				fields: {
					title: {
						'en-US': fileName
					},
					file: {
						'en-US': {
							fileName: fileName,
							contentType: 'image/jpg',
							uploadFrom: {
								sys: {
									type: 'Link',
									linkType: 'Upload',
									id: upload.sys.id
								}
							}
						}		
					}
				}
			})
			.then((asset) => {
				console.log('prcessing...');
				//console.log("Image ID:"+upload.sys.id);
				//console.log("Image Id assets:"+asset.sys.id);
				return asset.processForLocale('en-US', { processingCheckWait: 2000 });
			})
			.then((asset) => {
				console.log('publishing...');
				return asset.publish();
			})
			.then((asset) => {
				console.log(asset);
				return asset;
			})
			.then((asset) => {
				console.log('creating users...');
				console.log("File ID:"+asset.sys.id);
				return space.createEntry('users', {
					fields: {
						"username": {
							'en-US': req.body.username
						},
						"password": {
							"en-US" : req.body.pass
						},
						"email": {
							'en-US': req.body.email
						},
						"firstName": {
							"en-US" : req.body.firstname
						},
						"lastName": {
							'en-US': req.body.lastname
						},
						"gender": {
							"en-US" : req.body.gender
						},
						"profilePicture": {
							"en-US": {
								"sys": {
									"type": "Link",
									"linkType": "Asset",
									"id": asset.sys.id
								}
							}
						}
					}		
				})
				.then((users) => users.publish())
				.then((users) => console.log("success"))
			})
		})
		.catch((err) => {
			console.log(err);
		});	
	});

	req.flash('message', 'Sign Up Success');
	res.redirect("/register");
}

exports.profile=function(req,res) {
	var promise = request.get({ categories: 'category' });
	//req.flash("messages", "Sign Up Success");
	//req.flash('success', 'This is a flash message using the express-flash module.');
	
	promise.then(function(entries){		
		res.render('profile',{
							user : req.user,
							categories:entries.categories,
							viewPage:4,
							category:'',
							expressFlash: req.flash('message')
						  });	
	});	
}

exports.logout=function(req,res) {
	req.logout();
    res.redirect('/');
}

exports.login=function(req,res) {
	var promise = request.get({ categories: 'category' });
	//req.flash("messages", "Sign Up Success");
	//req.flash('success', 'This is a flash message using the express-flash module.');
	
	promise.then(function(entries){		
		res.render('login',{
							categories:entries.categories,
							viewPage:4,
							category:'',
							expressFlash: req.flash('message')
						  });	
	});
}
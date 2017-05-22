var express=require('express');
var app=express();

var routes=require('./routes/route.js');

app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));

app.get('/',routes.index);
app.get('/products',routes.products);
app.get('/articles',routes.articles);
app.get('/view/:id',routes.view);
app.get('/category/:id',routes.category_view);

var port = process.env.PORT || 8080;

var server=app.listen(port,function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});
module.exports=app;
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items = ["buy food", "cook food","eat food"];
var workItem = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

const thePath = require("path");

app.use(express.static(thePath.join(__dirname)));

app.get("/",function(req,res){
  let today = new Date();
  let dateView = {
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  let day = today.toLocaleDateString("en-US",dateView);

  res.render("list",{listTitle:day,newListItem:items});
});
app.post("/",function(req,res){

if( req.body.list === "work"){
  var item = req.body.newItem;
  workItem.push(item);
  res.redirect("/work");
}else{
  var item = req.body.newItem;
  items.push(item);
  res.redirect("/");}
});

app.get("/work",function(req,res){
 res.render("list",{listTitle:"work List",newListItem:workItem});
})

app.post("/work",function(req,res){
  var item = req.body.newItem;
  workItem.push(item);
  res.redirect("/work");
})

app.listen("2000",function(){
  console.log("Server started on port 3000");
});

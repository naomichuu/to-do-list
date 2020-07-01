const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const thePath = require("path");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(thePath.join(__dirname)));

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://admit-naomi:19931129qd@cluster0.zjyke.mongodb.net/todolistDB",{useNewUrlParser: true});

const itemSchema = {
  name : String

};

const Item = mongoose.model("Item", itemSchema);



const itemOne = new Item({
  name: "Wlecome to your todolist!"
});

const itemTwo = new Item({
  name: "Wlecome to your todolist!"
});

const itemThree = new Item({
  name: "Wlecome to your todolist!"
});

const defaultItem = [itemOne,itemTwo,itemThree];

const listSchema = {
  name:String,
  items:[itemSchema]
};

const List = mongoose.model("List",listSchema);

let today = new Date();
let dateView = {
  weekday:"long",
  day:"numeric",
  month:"long"
};
let day = today.toLocaleDateString("en-US",dateView);


app.get("/",function(req,res){


  Item.find({},function(err,foundItem){
    if(foundItem.length === 0){
      Item.insertMany(defaultItem,function(err){
        if(err){
          console.log("getting error");
        }else{
          console.log("success");
        }
      });
    res.redirect("/");
    }else{

    res.render("list",{listTitle:"Today",newListItem:foundItem});
  }
});

});

app.get("/:customListName", function(req, res){
  const customListName =_.capitalize(req.params.customListName);


  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItem
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list

        res.render("list", {listTitle: foundList.name, newListItem: foundList.items});
      }
    }
  });



});


app.post("/",function(req,res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name:itemName
  });


  if(listName === "Today"){

  item.save();

  res.redirect("/");
} else {
  List.findOne({name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  });

}

/*if( req.body.list === "work"){
  var item = req.body.newItem;
  workItem.push(item);
  res.redirect("/work");
}else{
  var item = req.body.newItem;
  items.push(item);
  res.redirect("/");} */
});

app.post("/delect",function(req,res){
  const checkItemId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === "Today" ){
  Item.findByIdAndRemove(checkItemId,function(err){
    if(!err){
      console.log("success delect");
      res.redirect("/");
    }
  });}else{
    List.findOneAndUpdate({name:listName},{$pull:{items: {_id:checkItemId}}},function(err,foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }
});


/*
app.get("/work",function(req,res){
 res.render("list",{listTitle:"work List",newListItem:workItem});
})

app.post("/work",function(req,res){
  var item = req.body.newItem;
  workItem.push(item);
  res.redirect("/work");
})
*/

app.listen(process.env.PORT || 2000, function(){
  console.log("Server started on port 2000");
});

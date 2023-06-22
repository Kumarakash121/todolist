//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://20001011004:Test123@cluster0.lvz6ymg.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];
// const 

const itemSchema={
  name:String
};
const ListSchema={
  name:String,
  items:[itemSchema]
}
const Item=mongoose.model("Item",itemSchema);
const List=mongoose.model("List",ListSchema);
const item1=new Item({
  name:"welcome to your todolist"
});

const item2=new Item({
 name:"Hit the + button to add a new item"
});
const item3=new Item({
   name:"<--hit this to delete"
});
const defaultItems=[item1,item2,item3];

// Item.insertMany(defaultItems)
//       .then(function () {
//         console.log("Successfully saved defult items to DB");
//       })
//       .catch(function (err) {
//         console.log(err);
//       });
app.get("/", function(req, res) {

// const day = date.getDate();
//  Item.find({},function(err,foundItems){
//   if(foundItems.length==0){
//     Item.insertMany(defaultItems)
//     .then(function () {
//       console.log("Successfully saved defult items to DB");
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
//     res.redirect("/");
//   }
//   else{
//     res.render("list", {listTitle: "Today", newListItems: foundItems});
//   }
//  })
Item.find({}).then(function(FoundItems){
    

  if(FoundItems.length==0){
        Item.insertMany(defaultItems)
        .then(function () {
          console.log("Successfully saved default items to DB");
        })
        .catch(function (err) {
          console.log(err);
        });
        res.redirect("/");
  }
  else{
  res.render("list", {listTitle: "Today", newListItems: FoundItems});
  }

})
 .catch(function(err){
  console.log(err);
})
 
  

});

app.get("/:customListName",function(req,res){
   const custom=req.params.customListName;
   List.findOne({name:custom})
      .then((foundlist)=>{
        if(!foundlist){
          // const items=new Item({
          //   name:custom
          // })
          const list=new List({
            name:custom,
            items:defaultItems
          });
          list.save();
          
        }
        else{
          res.render("list", {listTitle:foundlist.name, newListItems:foundlist.items });
        }
        
      })
      .catch(function(err){
        console.log(err);
      })
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;
  const item=new Item({
    name:itemName
  })

  if(listName=="Today"){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listName})
      .then((foundlist)=>{
       foundlist.items.push(item);
       foundlist.save();
       res.redirect("/"+listName);
        
      })
      .catch(function(err){
        console.log(err);
      })
  }
  
});
app.post("/delete",function(req,res){
  const id=req.body.checkbox;
   Item.findByIdAndRemove(id)
   .then(function(){
    console.log("deleted");
    res.redirect("/");
   })
   .catch(function(err){
      console.log(err);
   })
});
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

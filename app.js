const port = 3000 || process.env.PORT

const express = require('express');
const mongoose = require("mongoose");
const date = require(__dirname + '/date.js');

//express app.
const app = express();

//set ejs view engine.
app.set('view engine', 'ejs');
//Body Parser.
app.use(express.urlencoded({extended: true}));
//ROOT to STATIC FILES.
app.use(express.static("public"));

console.log(date.getCurrentDate());
console.log(date.getCurrentDayOfWeek());

//connect to Db.
mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err)
        console.log(err);
    else
        console.log("Successfully connected to todolistDB")
});

const itemSchema = {
    itemName: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    itemName: "Welcome to todo list."
});

const item2 = new Item({
    itemName: "hit the plus + button to add more.."
});

const defaultArray = [item1, item2];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List",listSchema);


app.get("/", function (request, response) {

    /*    switch (todayDate.getDay()) {

        case 0:
            day = "Sunday";
            break;

        case 1:
            day = "Monday";
            break;

        case 2:
            day = "Tuesday";
            break;

        case 3:
            day = "Wednesday";
            break;

        case 4:
            day = "Thursday";
            break;

        case 5:
            day = "Friday";
            break;

        case 6:
            day = "Saturday";
            break;

        default:
            console.log()
            break;
    }*/


    Item.find({}, function (err, foundItems) {
        console.log(foundItems);

        //todo - insert default data if list is empty.
        if (foundItems.length === 0) {
            Item.insertMany(defaultArray, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully to default added.")
                }
            });
            response.redirect("/");
        }
        //todo - render page
        else {
            response.render("list", {listTitle: "To-Do List", itemsList: foundItems});
        }

    });


});

app.post("/", function (request, response) {

    const itemName = request.body.newItem;
    const listName = request.body.list;

    const item = new Item({
        itemName: itemName
    });
    console.log(itemName);
    console.log(listName);
    if(listName === "To-Do List"){
        item.save();
        response.redirect("/");
    }else{
        console.log(listName);
        List.findOne({name: listName},function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            response.redirect("/" + listName);
        });
    }

});

app.post('/delete',function (req, res) {
    console.log(req.body.checkbox);
    console.log(req.body.listName);

    if(req.body.listName === "To-Do List"){

        Item.findByIdAndDelete(req.body.checkbox,function (err) {
            if(err){
                console.log(err);
            }else{
                console.log("Successfully deleted checked item.");
                res.redirect("/");
            }
        });

    }else{

        List.findOneAndUpdate({name: req.body.listName},{$pull: {items:{_id: req.body.checkbox}}},function (err,foundList){
            if(!err){
                res.redirect('/' + req.body.listName);
            }
        });
    }



})


app.get("/:customListName",function (req,res){

    List.findOne({name: req.params.customListName},function (err,foundList) {
       if(!err){
           if(!foundList){
               console.log("Create a new List.");

               const list = new List({
                   name: req.params.customListName,
                   items: defaultArray
               });

               list.save();
               res.redirect(`/${req.params.customListName}`);
           }else{
               console.log("Show an existing list.");
               res.render("list",{listTitle: foundList.name, itemsList: foundList.items});
           }
       }
    });


});


app.listen(port, function () {
    console.log(`App listening on port ${port}!`)
});


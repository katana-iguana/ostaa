const express = require("express");
const app = express();  // app is the server
const bodyParser = require("body-parser");
const hostname = '143.198.133.220';
const port = 5000;
const mongoose = require("mongoose"); 

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("./public_html"));
app.use(express.json());

app.listen(port, hostname, () => {
    console.log(`App listening at http://${hostname}:${port}/`);
});

const connectionString = "mongodb+srv://katanabierman:cLnGD21RrhVJfti9@cluster0.bydgnag.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(connectionString);
mongoose.connection.on('error', () => {
    console.log('There was a problem connecting to mongoDB');
});

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    title: String,
    description: String,
    image: String,
    price: Number,
    stat: String
});

var UserSchema = new Schema({
    username: String,
    password: String,
    listings: [Schema.Types.ObjectId],
    purchases: [Schema.Types.ObjectId]
});

var Item = mongoose.model('Item', ItemSchema, 'items');
var User = mongoose.model('User', UserSchema, 'users');

app.post('/add/user/', (req, res) => {
    var newUser = new User({username: req.body.username, 
        password: req.body.password, listings: null, purchases: null});
    console.log(newUser);
    newUser.save()
    .then( (doc) => { 
        res.end('SAVED SUCCESFULLY');
    })
    .catch( (err) => { 
        console.log(err);
        res.end('FAIL');
    });
}); 

app.post('/add/item/:curUser', (req, res) => {
    let curUser = req.params.curUser;
    var newItem = new Item({title: req.body.title,
        description: req.body.desc,
        image: req.body.itemImg,
        price: req.body.price,
        stat: req.body.status});
    let p1 = User.find({username: curUser}).exec();
    p1.then( (results) => {
        for (let i=0; i<results.length; i++) {
            if (results[i].listings === null) {
                results[i].listings = [];
            }
            results[i].listings.push(newItem.id);
            results[i].save();
        }
    });
    newItem.save()
    .then( (doc) => { 
        res.end('SAVED SUCCESFULLY');
    })
    .catch( (err) => { 
        console.log(err);
        res.end('FAIL');
    });
}); 

app.get('/get/users/', (req, res) => {
    let p1 = User.find({}).exec();
    p1.then( (results) => { 
      res.end( JSON.stringify(results) );
    });
    p1.catch( (error) => {
      console.log(error);
      res.end('FAIL');
    });
});

app.get('/get/items/', (req, res) => {
    let p1 = Item.find({}).exec();
    p1.then( (results) => { 
      res.end( JSON.stringify(results) );
    });
    p1.catch( (error) => {
      console.log(error);
      res.end('FAIL');
    });
});

app.get('/get/listings/:curUser', (req, res) => {
    let curUser = req.params.curUser;
    let p1 = User.find({username: curUser}).exec();
    p1.then( (results) => { 
        if (results.listings === undefined) {
            res.end('USER HAS NO LISTINGS');
        } else {
            res.end( JSON.stringify(results.listings));
        }
    });
    p1.catch( (error) => {
        console.log(error);
        res.end('USER NOT IN DATABASE');
    });
});

app.get('/get/purchases/:curUser', (req, res) => {
    let curUser = req.params.curUser;
    console.log("username in URL: " + curUser);
    let p1 = User.find({username: curUser}).exec();
    p1.then( (results) => { 
        if (results.purchases === undefined) {
            res.end('USER HAS NO PURCHASES');
        } else {
            res.end( JSON.stringify(results.purchases));
        }
    });
    p1.catch( (error) => {
        console.log(error);
        res.end('USER NOT IN DATABASE');
    });
});

app.get('/search/users/:keyword', (req, res) => {
    let keyword = req.params.keyword;
    let p1 = User.find( { username: { $regex: keyword } } ).exec();
    p1.then( (results) => { 
      res.end( JSON.stringify(results) );
    });
    p1.catch( (error) => {
      console.log(error);
      res.end('FAIL');
    });
});

app.get('/search/items/:keyword', (req, res) => {
    let keyword = req.params.keyword;
    let p1 = Item.find( { description: { $regex: keyword } } ).exec();
    p1.then( (results) => { 
      res.end( JSON.stringify(results) );
    });
    p1.catch( (error) => {
      console.log(error);
      res.end('FAIL');
    });
});



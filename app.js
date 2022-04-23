/*============================
    Require npm Modules
============================*/
require("dotenv").config();
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");

/*============================
          Setup App
============================*/
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

/*============================
        Setup Database
============================*/
mongoose.connect("mongodb://localhost:27017/userDb");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is REQUIRED"]
    },
    password: {
        type: String,
        required: [true, "Password is REQUIRED"]
    }
});

/*   Mongoose Encryption   */
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

/*============================
     Handle GET Requests
============================*/
app.get("/", function(req, res){
    res.render("home");
});
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});

/*============================
    Handle POST Requests
============================*/
app.post("/register", function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const newUser = new User({
        email: email,
        password: password
    });
    newUser.save(function(err){
        if(! err){
            res.render("secrets");
        }else{
            console.log(err);
        }
    });
});

app.post("/login", function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email}, function(err, foundUser){
        if(foundUser){
            if(! err){
                if(foundUser.password === password){
                    res.render("secrets");
                }else{
                    console.log("Wrong Password");
                }
            }else{
                console.log(err);
            }
        }else{
            console.log("User not found.");
        }
    });
});
/*============================
          Run Server
============================*/
let port = process.env.PORT;
if(port == "" || port == null){
    port = 3000;
}
app.listen(port, function(){
    console.log("Server Live on Port 3000");
});
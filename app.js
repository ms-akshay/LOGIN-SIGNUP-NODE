const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const Collection = require("./schema");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/akshaydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/loginform", (req, res) => { 
  res.redirect("login.html");
});

app.listen(3002, () => {
  console.log(`Example app listening at http://localhost: 3002`);
});

app.post("/form", (req, res) => {
  var email = req.body.email;

  //console.log(db.collection("akshay").find());
  Collection.findOne({ email: req.body.email }, function (error, user) {
    if (user === null) {
      console.log("User Does not exist");
      Collection.create(req.body);
      res.redirect("success.html");
    } else {
      res.redirect("/");
      console.log("User Already exist");
      // res.send("Choose a different mail id");
    }
    console.log(user);
  });
});

app.post("/login", async (req, res) => {
  const email2 = req.body.email;
  console.log('email heree is ',email2)
  var e = await Collection.findOne({ email: email2 });
  console.log('e here is ',e)
  if (e) {
    if (req.body.password === e.password) {
      res.redirect("success.html");
    } else {
      res.redirect("/loginform");
    }
  } else {
    // res.redirect("/loginform");
    res.send('User does not exist');
    // console.log("User does not exist");
  }
});

// app.post("/login", (req, res) => {
//   var email = req.body.email;
//   var password = req.body.password;

//   Collection.findOne(
//     ({ email: req.body.email }, { password: req.body.password }),
//     function (error, user) {
//       if (user === null) {
//         console.log("Please check the mail id or password");
//         console.log(user);
//         res.redirect("/loginform");
//       } else {
//         console.log(user);
//         res.redirect("success.html");
//       }
//     }
//   );
// });

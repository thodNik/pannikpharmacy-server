require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const app = express();
const Post = require("./Models/Posts");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

/*=======================MAILCHIMP API=========================*/

app.post("/subUsers", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const yourEmail = req.body.yourEmail;

  const data = {
    members: [
      {
        email_address: yourEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const url = process.env.MAILCHIMP_URL;

  const headers = {
    auth: {
      username: process.env.USER_NAME,
      password: process.env.API_KEY,
    },
  };

  const request = axios
    .post(url, data, headers)
    .then((response) => {
      console.log("User subscribed!");
    })
    .catch((error) => {
      console.log(error);
    });
});

/*=======================BLOG=========================*/

mongoose.connect(process.env.MONGODB_URL);  


app.get("/getPosts", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      res.json(err);
    } else {
      res.json(posts);
    }
  });
});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      res.json(post);
    }
  });
});

app.post("/createPost", (req, res) => {
  const post = req.body;
  const newPost = new Post(post);
  newPost.save();
});

/*=======================PORT=========================*/

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.listen(port, () => {
  console.log("Server is up and running on port 4000");
});

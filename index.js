const express = require("express");
const app = express();
const port = 3000;

const _ = require("lodash");
const filter = require("lodash.filter");

app.use(express.static(__dirname + "/public"));

app.get("/1", (req, res) => {
  res.sendFile(__dirname + "/1. 함수형 프로그래밍 개요.html");
});

app.get("/2", (req, res) => {
  res.sendFile(__dirname + "/2. 함수형으로 전환하기.html");
});

app.get("/3", (req, res) => {
  res.sendFile(__dirname + "/3. 컬렉션 중심 프로그래밍.html");
});

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log(`app listening on port ${port}`);
});

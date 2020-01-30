"use strict";
// example client app

const PORT = process.env.PORT || "8080";

const express = require("express");
const app = express();
const axios = require("axios");

// insert these 2 lines into client's app.js
const { countAllRequests } = require("./monitoring");
app.use(countAllRequests());

app.get("/", (req, res) => {
  axios
    .get(`http://localhost:${PORT}/middle-tier`)
    .then(() => axios.get(`http://localhost:${PORT}/middle-tier`))
    .then(result => {
      res.send(result.data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send();
    });
});

app.get("/middle-tier", (req, res) => {
  axios
    .get(`http://localhost:${PORT}/backend`)
    .then(() => axios.get(`http://localhost:${PORT}/backend`))
    .then(result => {
      res.send(result.data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send();
    });
});

app.get("/backend", (req, res) => {
  // res.send("Hello from the backend");
  axios
    .get(`http://localhost:9411/zipkin/api/v2/traces`)
    .then(() => axios.get(`http://localhost:9411/zipkin/api/v2/traces`))
    .then(result => {
      res.send(result.data[0]); // this sends the JSON data of traces to render on localhost 8080
    })
    .catch(err => {
      console.error(err);
      res.status(500).send();
    });
});


app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

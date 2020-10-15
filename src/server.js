"use strict";

// LINK !!!
// https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl
// sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./selfsigned.key -out selfsigned.crt

// change these:
const PORT = 9443
const DIRECTORY = "/../../"


// =========
const fs = require("fs");

// const http = require('http');
const https = require("https");
const express = require("express");
const os = require("os");

let privateKey, certificate;

const computerName = os.hostname();
console.log("running on", computerName);

if (computerName == "pi3") {
  // start with SUDO!!!
  privateKey = fs.readFileSync(
    "/someotherserver/privkey.pem",
    "utf8"
  );
  certificate = fs.readFileSync(
    "/someotherserver/cert.pem",
    "utf8"
  );
} else {
  privateKey = fs.readFileSync("../keys/selfsigned.key", "utf8");
  certificate = fs.readFileSync("../keys/selfsigned.crt", "utf8");
}

const readline = require("readline");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
  console.log(str);
  console.log(key);
  if (str == "q") {
    console.log("... quitting.");
    process.exit();
  }
  if (str == "p") {
    console.log(JSON.stringify(world));
    console.log(JSON.stringify(Object.keys(world)));
  }
  if (str == "a") {
    let msg = { type: "cmd", "cmd": "reload" };
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        // console.log(client.pars.name)
        client.send(JSON.stringify(msg));
      }
    });
  }
});

const credentials = { key: privateKey, cert: certificate };

let app = express();

// CORS!
// this must be before the routes
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// CHANGE THIS:
app.use("/", express.static(__dirname + DIRECTORY));

// // Express routes
// // curl -k https://localhost:4000/users/123/books/456
// app.get("/users/:userId/books/:cmdId", function (req, res) {
//   console.log(req.params);
//   res.send(JSON.stringify(req.params) + "\n");
// });

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT);
console.log("starting server on port:", PORT);

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"


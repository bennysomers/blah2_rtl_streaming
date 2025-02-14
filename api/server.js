const express = require('express');
const dgram = require('dgram');
const net = require("net");

var stash_map = require('./stash/maxhold.js');
var stash_detection = require('./stash/detection.js');
var stash_iqdata = require('./stash/iqdata.js');
var stash_timing = require('./stash/timing.js');
var stash_falsetargets = require('./stash/falsetargets.js');

// constants
const PORT = 3000;
const HOST = '0.0.0.0';
var map = '';
var detection = '';
var track = '';
var timestamp = '';
var timing = '';
var iqdata = '';
var falsetargets = '';
var data = '';
var data_map;
var data_detection;
var data_tracker;
var data_timestamp;
var data_timing;
var data_iqdata;
var data_falsetargets;
var capture = false;

// api server
const app = express();
// header on all requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/api/map', (req, res) => {
  res.send(map);
});
app.get('/api/detection', (req, res) => {
  res.send(detection);
});
app.get('/api/tracker', (req, res) => {
  res.send(track);
});
app.get('/api/timestamp', (req, res) => {
  res.send(timestamp);
});
app.get('/api/timing', (req, res) => {
  res.send(timing);
});
app.get('/api/iqdata', (req, res) => {
  res.send(iqdata);
});
app.get('/api/falsetargets', (req, res) => {
  res.send(falsetargets);
});

// stash API
app.get('/stash/map', (req, res) => {
  res.send(stash_map.get_data_map());
});
app.get('/stash/detection', (req, res) => {
  res.send(stash_detection.get_data_detection());
});
app.get('/stash/iqdata', (req, res) => {
  res.send(stash_iqdata.get_data_iqdata());
});
app.get('/stash/timing', (req, res) => {
  res.send(stash_timing.get_data_timing());
});
app.get('/stash/falsetargets', (req, res) => {
  res.send(stash_falsetargets.get_data_falsetargets());
});

// read state of capture
app.get('/capture', (req, res) => {
  res.send(capture);
});
// toggle state of capture
app.get('/capture/toggle', (req, res) => {
  capture = !capture;
  res.send('{}');
});
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

// tcp listener map
const server_map = net.createServer((socket) => {
  socket.write("Hello From Server!")
  socket.on("data", (msg) => {
    data_map = data_map + msg.toString();
    if (data_map.slice(-1) === "}") {
      map = data_map;
      data_map = '';
    }
  });
  socket.on("close", () => {
    console.log("Connection closed.");
  })
});
server_map.listen(3001);

// tcp listener detection
const server_detection = net.createServer((socket) => {
  socket.write("Hello From Server!")
  socket.on("data", (msg) => {
    data_detection = data_detection + msg.toString();
    if (data_detection.slice(-1) === "}") {
      detection = data_detection;
      data_detection = '';
    }
  });
  socket.on("close", () => {
    console.log("Connection closed.");
  })
});
server_detection.listen(3002);

// tcp listener tracker
const server_tracker = net.createServer((socket) => {
  socket.write("Hello From Server!")
  socket.on("data", (msg) => {
    data_tracker = data_tracker + msg.toString();
    if (data_tracker.slice(-1) === "}") {
      track = data_tracker;
      data_tracker = '';
    }
  });
  socket.on("close", () => {
    console.log("Connection closed.");
  })
});
server_tracker.listen(3003);

// tcp listener timestamp
const server_timestamp = net.createServer((socket) => {
  socket.write("Hello From Server!")
  socket.on("data", (msg) => {
    data_timestamp = data_timestamp + msg.toString();
    timestamp = data_timestamp;
    data_timestamp = '';
  });
  socket.on("close", () => {
    console.log("Connection closed.");
  })
});
server_timestamp.listen(4000);

// tcp listener timing
const server_timing = net.createServer((socket) => {
  socket.write("Hello From Server!")
  socket.on("data", (msg) => {
    data_timing = data_timing + msg.toString();
    if (data_timing.slice(-1) === "}") {
      timing = data_timing;
      data_timing = '';
    }
  });
  socket.on("close", () => {
    console.log("Connection closed.");
  })
});
server_timing.listen(4001);

// tcp listener iqdata metadata
const server_iqdata = net.createServer((socket) => {
  socket.write("Hello From Server!")
  socket.on("data", (msg) => {
    data_iqdata = data_iqdata + msg.toString();
    if (data_iqdata.slice(-1) === "}") {
      iqdata = data_iqdata;
      data_iqdata = '';
    }
  });
  socket.on("close", () => {
    console.log("Connection closed.");
  })
});
server_iqdata.listen(4002);

// tcp listener falsetargets
const server_falsetargets = net.createServer((socket) => {
  socket.write("Hello From Server!")
  socket.on("data", (msg) => {
    data_falsetargets = data_falsetargets + msg.toString();
    if (data_falsetargets.slice(-1) === "}") {
      falsetargets = data_falsetargets;
      data_falsetargets = '';
    }
  });
  socket.on("close", () => {
    console.log("Connection closed.");
  })
});
server_falsetargets.listen(4003);

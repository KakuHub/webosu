const http = require('http');
const url = require('url');
const fs = require('fs');

const hostname = '127.0.0.1';
const postport = 4000;
const getport = 4001;
const dataFilePath = '/home/sensokaku/webosu/data.json';

var a = [];

function loadData() {
  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    a = JSON.parse(data);
    console.log(`Loading Data`);
  }
}

function saveData() {
  fs.writeFileSync(dataFilePath, JSON.stringify(a), 'utf8');
  console.log(`Saving Data`);
}

loadData();

const postserver = http.createServer((req, res) => {
  var q = url.parse(req.url, true).query;
  // Change: Use the 'username' from query params, fallback to 'Guest' if not provided
  q.username || 'Guest';  // Or rename 'ip' to 'username' for clarity: q.username = q.username || 'Guest';
  if (q.title || q.sid) {
    a.push(q);
  }
  if (a.length > 16) {
    a.shift();
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end("");
  saveData();
});

const getserver = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(a));
});

postserver.listen(postport, hostname, () => {
  console.log(`Server running at http://${hostname}:${postport}/`);
});
getserver.listen(getport, hostname, () => {
  console.log(`Server running at http://${hostname}:${getport}/`);
});
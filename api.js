const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const postport = 4000;
const getport = 4001;

var a = [];

const postserver = http.createServer((req, res) => {
  var q = url.parse(req.url, true).query;
  // Change: Use the 'username' from query params, fallback to 'Guest' if not provided
  q.ip = q.username || 'Guest';  // Or rename 'ip' to 'username' for clarity: q.username = q.username || 'Guest';
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
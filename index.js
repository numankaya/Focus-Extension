var http = require("http");
var url = require("url");
var fs = require("fs");

console.log("server working");

http
  .createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "./NNC.json";
    fs.readFile(filename, function (err, data) {
      console.log(filename);
      if (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end("404 NOT Found");
      }
      res.writeHead(200, {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "If-Modified-Since",
      });
      res.write(data);
      return res.end();
    });
  })
  .listen(8080);

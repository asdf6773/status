var express = require("express")
var app = express();
var server = app.listen(8888)
var fs = require('fs');
var socket = require("socket.io");
var io = socket(server);
var bodyParser = require('body-parser');
var weiboData = JSON.parse(fs.readFileSync('./public/weibo.json', 'utf8'));;
var comments = JSON.parse(fs.readFileSync('./public/comments.json', 'utf8'));
var consoleData = JSON.parse(fs.readFileSync('./public/record.json', 'utf8'));
var weiboAPI = "https://api.weibo.com/2/statuses/public_timeline.json?access_token=2.00eSb_UD2DU1eDf3a9e590d50d5pCZ"

var timer = 60 * 60 * 1000;
setInterval(function() {
    request(weiboAPI, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
            console.log('refresh weiboData');
            weiboData = obj;
            fs.writeFile('./public/weibo.json', JSON.stringify(weiboData), function(err) {
            });
        }
    })
}, timer);

consoleData.show = false;
consoleData.onlineUser = 0;
consoleData.onlineProjector = 0;
consoleData.currentImage = 0;
consoleData.isFlushing = false;
consoleData.faucetOnline = 0;
consoleData.mirrorOnline = 0;
consoleData.dryerOnline = 0;
consoleData.status_faucet = 0;
consoleData.status_toilet = 0;
consoleData.status_dryer = 0;
console.log(consoleData)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ //此项必须在 bodyParser.json 下面,为参数编码
    extended: false
}));
app.use(express.static(__dirname + '/public'))

//API
app.get("/record", function(req, res) {
    res.sendFile(__dirname + "/public/record.json");
});

app.get("/weibo", function(req, res) {
    res.sendFile(__dirname + "/public/weibo.json");
});

app.get("/comments", function(req, res) {
    res.sendFile(__dirname + "/public/comments.json");
});

console.log("listen to 8888")
io.of("/setup").on('connection', function(socket) {
    socket.on("check", function() {
        socket.emit("connected");
    })
    socket.on('disconnect', function() {
        //text me
    });
});

io.of("/update").on('connection', function(socket) {
    socket.on("record", function(data) {
        console.log(data.likes)
        console.log(comments[comments.comments[comments.comments.length]])
        fs.writeFile('./public/lib/record.json', JSON.stringify(data), function(err) {});
    })
    socket.on("comments", function(data) {
        console.log(data.likes)
        fs.writeFile('./public/lib/comments.json', JSON.stringify(data), function(err) {});
    })
    socket.on("weibo", function(data) {
        console.log(data.likes)
        fs.writeFile('./public/lib/weibo.json', JSON.stringify(data), function(err) {});
    })
    socket.on('disconnect', function() { //text me
    });
});

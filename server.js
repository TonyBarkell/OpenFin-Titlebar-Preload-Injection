var openfinLauncher = require('hadouken-js-adapter');
var portfinder = require('portfinder');
var express = require('express');
var path = require('path');
var app = express();
var target;

app.use(express.static(__dirname + '/public'));

portfinder.getPortPromise().then((port) => {
    serverPort = port;
    target = "http://localhost:" + port;
    app.listen(port, () =>{ 
        console.log("Server started at: " + target);
        openfinLauncher.launch({manifestUrl: target + "/app.json?manifest=" + encodeURI(JSON.stringify(buildManifest()))});
    });
    
}).catch((err) => {
    console.log("Unable to discover a free port: " + err);
    console.log("-- Exiting --");
});

// Express Routes
app.get('/app.json', (req, res) => {
    var manifest = JSON.parse(req.query.manifest);
    console.log("Serving Manifest:");
    console.log(manifest)
    res.send(manifest);
});

app.get('/index.html', (req, res) => {
    index = path.resolve("./public/template/index.html");
    res.sendFile(index);
});

app.get('/favicon.ico', (req, res) => {
    icon = path.resolve("./public/template/favicon.ico");
    res.sendFile(icon );
});

app.get('/preload.js', (req, res) => {
    console.log("Returning Preload");
    preload = path.resolve("./public/app/scripts/preload.js");
    res.sendFile(preload );
});

app.get('/minimize.svg', (req, res) => {
    icon = path.resolve("./public/app/shared/images/minimize.svg");
    res.sendFile(icon);
});

app.get('/close-x.svg', (req, res) => {
    icon = path.resolve("./public/app/shared/images/close-x.svg");
    res.sendFile(icon);
});

app.get('/maximize.svg', (req, res) => {
    icon = path.resolve("./public/app/shared/images/maximize.svg");
    res.sendFile(icon);
});

app.get('/restore.svg', (req, res) => {
    icon = path.resolve("./public/app/shared/images/restore.svg");
    res.sendFile(icon);
});

function buildManifest(){
    var manifest = require("./public/app/config/app.json");
    manifest.startup_app.applicationIcon = target + "/favicon";
    manifest.shortcut.icon = target + "/favicon";
    manifest.startup_app.preloadScripts = [{url: target + "/preload.js"}];
    manifest.startup_app.customData = serverPort;
    return JSON.stringify(manifest);
};
// Runs the scraper.
const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Email
    const [el1] = await page.$x('/html/body')
    const txt1  = await el1.getProperty('textContent');
    const text  = await txt1.jsonValue();
    let email   = getEmail(text);
    let phone   = getPhone(text);
    browser.close();
    console.log("Email: " + email, "Phone #: " + phone);
    return email, phone;
}

// Finds the email using REGEX.
function getEmail(text) {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
}

function getPhone(text) {
    return text.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g);
}


// Runs the server.
const express = require("express");
const app     = express();
const server  = require("http").Server(app);
const port    = 3000;
const io      = require('socket.io')(server);

// Serve the static website files.
app.use(express.static("public"));

// Starts the server.
server.listen(port, function () {
    console.log("Server is running on "+ port +" port");
});


// Socket
const users = {};
io.on('connection', function(socket){
    // Runs the scraper when the input is submitted.
    console.log("user connected");

    // Promise handler.
    socket.on("website", (address) => {
        scrapeProduct(address).then((result1, result2) => {
            socket.emit("emails", result1);
            socket.emit("phone", result2)
            console.log(result1, result2)
        });
        console.log(address);
    });

  socket.on('disconnect', function(){
    console.log('user ' + users[socket.id] + ' disconnected');
    // remove saved socket from users object
    delete users[socket.id];
  });
});
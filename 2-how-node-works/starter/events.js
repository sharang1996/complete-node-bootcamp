const EventEmitter = require("events");
const http = require("http");

const myEmitter = new EventEmitter();

myEmitter.on("newSale", () => {
  console.log("there`s a new sale!!");
});

myEmitter.on("newSale", () => {
  console.log("hurry only while stocks last!");
});

myEmitter.on("newSale", (stock) => {
  console.log(`there are now only ${stock} remaining in stock!`);
});

myEmitter.emit("newSale", 9);
myEmitter.emit("newSale");
myEmitter.emit("newSale");

//extend the class to make your own!
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const mySalesEmitter = new Sales();

mySalesEmitter.on("newSale", () => {
  console.log("hurry Sales have been great!");
});

mySalesEmitter.emit("newSale");

////////////////////////////////

const server = http.createServer();

server.on("request", (req, resp) => {
  console.log("request received!");
});

server.on("request", (req, resp) => {
  console.log("another handler!");
  resp.end("request recieved");
});

server.on("close", () => {
  console.log("server shut!");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server started, waiting for requests!");
});

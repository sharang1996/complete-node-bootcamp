const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, resp) => {
  //solution 1
  //   fs.readFile("test-file.txt", "utf8", (err, data) => {
  //     if (err) console.log(err);
  //     resp.end(data);
  //   });
  //solution 2
  //   const readable = fs.createReadStream("test-file.txt");
  //   readable.on("data", (chunk) => {
  //     resp.write(chunk);
  //   });
  //   readable.on("end", () => {
  //     resp.end();
  //   });
  //   readable.on("error", (err) => {
  //     resp.statusCode(404);
  //     resp.end("file not found");
  //   });
  //solution 3
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(resp);
  // readableSource stream to writable destination stream output
});

server.listen(8000, "127.0.0.1", () => {
  console.log("started!");
});

const http = require("http")

const port = 1000

const server = (req, res) => {

    res.end("I am your server..")

}

http.createServer(server).listen(port)


const express = require("express")

const app = express()

const port = 1000

app.listen(port)

app.get(("/contacto"), (req, res) => {

    res.end("Desde aca vamos a contactarnos..")

})

const express = require("express")

const app = express()

const port = 1000

app.listen(port)

app.use( express.static("public") )

app.use( express.urlencoded({extended : true}) )

app.get(("/contacto"), (req, res) => {

    res.end("Desde aca vamos a contactarnos..")

})

app.post(("/enviar"), (req, res) => {

    const contacto = req.body
    console.log(contacto)
    res.end("Desde aca vamos a hacer algo muy loco..")

})
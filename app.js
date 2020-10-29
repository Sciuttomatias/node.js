const express = require("express")

const bodyParser = require("body-parser")

const expshbs = require("express-handlebars")

const app = express()

const nodemailer = require("nodemailer")

const port = 1000

const miniOutlook = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: process.env.PUERTO_MAIL,
    auth: {
        user: process.env.CASILLA_MAIL,
        pass: process.env.CLAVE_MAIL
    }
})

app.listen(port)

app.use( express.static("public") )
app.use( express.urlencoded( {extended: true} ) )

// app.use( express.urlencoded({extended : true}) )

app.get(("/contacto"), (req, res) => {

    res.end("Desde aca vamos a contactarnos..")

})

//////////// Configuracion del View engine (Middleware de Handlebars)////////////////
app.engine("handlebars", expshbs())
app.set("view wngine", "handlebars")
//////////////////Body-Parser Middleware//////////////////
app.use( bodyParser.urlencoded( {extended: false} ) )
app.use( bodyParser.json() )
/////////////////////////////////////////////////////////////////////////////////////

app.post(("/enviar"), (req, res) => {
    const contacto = req.body
    console.log(contacto)

    miniOutlook.sendMail({
        from: contacto.correo, // sender address
        to: "sciuttomatias@gmail.com", // list of receivers
        replyTo: contacto.correo,
        subject: `Asunto #${contacto.asunto}` , // Subject line
        html: `${contacto.mensaje}` // html body
      })

    res.end("Desde aca vamos a hacer algo muy loco..")

})
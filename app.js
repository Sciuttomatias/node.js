const express = require("express")

const app = express()

const nodemailer = require("nodemailer")

const port = 1000


const miniOutlook = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'morgan.streich58@ethereal.email',
        pass: 'kjJZgqGgedZvbQryqd'
    }
})



app.listen(port)

app.use( express.static("public") )

app.use( express.urlencoded({extended : true}) )

app.get(("/contacto"), (req, res) => {

    res.end("Desde aca vamos a contactarnos..")

})

app.post(("/enviar"), (req, res) => {
    const contacto = req.body
    console.log(contacto)

    miniOutlook.sendMail({
        from: contacto.correo, // sender address
        to: "sciuttomatias@gmail.com", // list of receivers
        subject: `Asunto #${contacto.asunto}` , // Subject line
        html: `${contacto.mensaje}`, // html body
      })

    res.end("Desde aca vamos a hacer algo muy loco..")

})





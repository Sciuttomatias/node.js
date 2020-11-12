const express = require("express")

const bodyParser = require("body-parser")

const expshbs = require("express-handlebars")

const app = express()

const nodemailer = require("nodemailer")

const joi = require("joi")

const expressFileUpload = require("express-fileupload")

require('dotenv').config()

const {MongoClient, ObjectId} = require("mongodb")

const API = express.Router()

const { HOST_MAIL,
        PUERTO_MAIL,
        CASILLA_MAIL,
        CLAVE_MAIL,
        MONGODB_USER,
        MONGODB_PASS,
        MONGODB_HOST,
        MONGODB_BASE
    } = process.env

const port = 1000

const miniOutlook = nodemailer.createTransport({
    host: HOST_MAIL,
    port: PUERTO_MAIL,
    auth: {
        user: CASILLA_MAIL,
        pass: CLAVE_MAIL
    }
})

const schema = joi.object({
    nombre: joi.string().max(30).required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'tech'] } }).required(),
    asunto: joi.number().integer().required(),
    mensaje: joi.string().required() 
})

const conecctionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}/${MONGODB_BASE}?retryWrites=true&w=majority`

const conecctioDB = async () => {

    const client = await MongoClient.connect(conecctionString, {useUnifiedTopology : true})

    return await client.db("catalogo")

}

app.listen(port)

app.use( express.static("public") )
app.use( express.json() )  //Middleware que transformara de application/json a Object
app.use( express.urlencoded( {extended: true} ) ) //Middleware que transforma de "application/x-www-form-urlencoded" a Object
app.use( expressFileUpload() ) //de "multipart/form-data" a Object + File

app.use("/api", API)

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

    const contacto = req.body  // <-- Datos desde HTTP Query String

    const { archivo } = req.files

    console.log(req.files)

    const ubicacion = __dirname + "/public/uploads" + archivo.name

    console.log("Se va a guardar en:")
    console.log(ubicacion)
    
    archivo.mv(ubicacion, error => {
        if (error){
            console.log("No se movió..")
        }
    })

    return res.end("Mira la consola..")

    const validate = schema.validate( contacto )
    const { error, value } = schema.validate({ contacto })


    if (error){
        const msg = {
            error: error.details.map(e => {
                console.log(e.message)
            })
        }

        res.end(error.details[0].message)
    } else{
        miniOutlook.sendMail({
            from: contacto.correo, // sender address
            to: "sciuttomatias@gmail.com", // list of receivers
            replyTo: contacto.correo,
            subject: `Asunto #${contacto.asunto}` , // Subject line
            html: `${contacto.mensaje}` // html body
        })
        
        res.end("Desde aca vamos a hacer algo muy loco..")
    }
})

/////////////// API  ///////////////////////
 

///Crear///

API.post(("/v1/pelicula"), async (req, res) => {

    const db = await conecctioDB()

    const respuesta = {
        msg: "Acá vamos a crear peliculas..."
    }
    res.json(respuesta)
})

////Read///

API.get(("/v1/pelicula"), async (req, res) => {

    // console.log( req.query.id ) // <-- Datos desde HTTP Query String

    const db = await conecctioDB()

    const peliculas = await db.collection("peliculas").find({}).toArray()

    res.json(peliculas)
})

API.get(("/v1/pelicula/:id"), async (req, res) => {

    const { id } = req.params

    //Aca deberia ir la validacion de si el ID tiene datos...

    try{

        const db = await conecctioDB()

        const peliculas = await db.collection("peliculas")
    
        const busqueda = { "_id" : ObjectId(id) }
    
        const resultado = await peliculas.find( busqueda ).toArray()

        return res.json(resultado)

    } catch (error) {

        return res.json( {ok: false, msg: "Pelicula no encontrada"} )

    }

   

    res.end( resultado )

})

///Update///

API.put("/v1/pelicula", async (req, res) => {

    const db = await conecctioDB()

    const respuesta = {
        msg: "Acá vamos a actualizar peliculas..."
    }
    res.json(respuesta)
})

////Delete////

API.delete("/v1/pelicula", async (req, res) => {

    const db = await conecctioDB()

    const respuesta = {
        msg: "Acá vamos a borar peliculas..."
    }
    res.json(respuesta)
})
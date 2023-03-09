const express = require("express")
const dotenv = require ("dotenv")
const cookieParser = require ("cookie-parser")

const app = express()

//seteamos el motor de plantillas
app.set("view engine", "ejs")

//seteamos carpeta publica
app.use(express.static("public"))

//para proceasr datos de los forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos vareables de entorno
dotenv.config({path: "./env/.env"})

//seteamos las cookies
app.use(cookieParser())

//Llamar al router
app.use("/", require("./routes/router"))


app.listen(3000, ()=>{
    console.log("Server ON in http://localhost:3000")
})
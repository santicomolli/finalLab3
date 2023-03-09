const express = require('express');
const router = express.Router()
const authController = require("../controllers/authController")


//RUTAS PARA LAS VISTAS

//Ruta ingreso exitoso
router.get("/", authController.isAuthenticated, (req, res) => {
    res.render('index')
})
//Ruta de Login
router.get("/login", (req, res) => {
    res.render('login', {alert: false})
})
//Ruta de Registro
router.get("/register", (req, res) => {
    res.render('register')
})


//RUTAS PARA METODOS DEL CONTROLLER
router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/logout", authController.logout)

module.exports = router
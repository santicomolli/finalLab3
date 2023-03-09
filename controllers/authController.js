const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const {promisify} = require ("util")
const Swal = require('sweetalert2')



//procedimiento para registrarnos
exports.register = async (req, res) => {

    try {
        //agarro los nombres del form
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass
        //encripto la contraseña
        let passHash = await bcryptjs.hash(pass, 8)
        //mando los datos a la DB
        conexion.query("INSERT INTO users SET ?", {user:user, name:name, pass:passHash}, (error, result) => {
            if (error) {console.log(error)}
            res.redirect("/login")
        })
    } catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res) => {
    
    try {
        //agarro los nombres del form de login
        const user = req.body.user 
        const pass = req.body.pass 
        console.log(user+"."+pass)

        if (!user || !pass)//si estan vacios tirame error
        {
            res.render("login", {
                alert:true,
                alertTitle:"Advertencia",
                alertMessage: "Usuario o contraseña incorrectos",
                alertIcon:"info",
                showConfirmButton:true,
                timer:false,
                ruta:"login"
            })
        }else{
            conexion.query("SELECT * FROM users WHERE user = ?", [user], async(error, results) => {

                if (results.lenght == 0 || !(await bcryptjs.compare(pass, results[0].pass))) 
                {
                    res.render("login", {
                        alert:true,
                        alertTitle:"Advertencia",
                        alertMessage: "Usuario o contraseña incorrectos",
                        alertIcon:"info",
                        showConfirmButton:true,
                        timer:false,
                        ruta:"login"
                    })
                }else{
                    
                    //inicio de sesion OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    
                    console.log("TOKEN:" + token+ "para el usuario" + user)
                    
                    const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly:true
                    }
                    res.cookie("jwt", token, cookiesOptions)
                    res.redirect("/")
                }
            })
        }

    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next) => {
    
    if (req.cookies.jwt)
    {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query("SELECT * FROM users WHERE id = ?", [decodificada.id], (error, results)=>{
                if (!results)
                {
                    return next()
                }
                req.user = results[0]
                return next()
            })

        } catch (error) {
            console.log(error)
            return next()
        }    
    }
    else{
        res.redirect("/login")
    }
}


exports.logout = (req,res)=>{
    res.clearCookie("jwt")
    return res.redirect("/login")
}
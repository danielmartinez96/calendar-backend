const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User-model');
const { use } = require('../routes/authRoute');
const { generarJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { name, email, password } = req.body;
    try {

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario ya esta registrado con es correo electronico'
            });
        }

        user = new User(req.body);
        
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password= bcrypt.hashSync(password,salt);

        await user.save();

        // Generar JWT
        const token = await generarJWT(user._id,user.name);


        res.status(201).json({
            ok: true,
            uid:user._id,
            name:user.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Por favor, hable con el administrador"
        })
    }
}

const loginUser = async (req, res = response) => {

    const {email,password}= req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese correo electronico'
            });
        }
        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password,user.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Password incorrecto'
            })
        }

        //Generar nuestro JWT
        const token = await generarJWT(user._id,user.name);

        res.json({
            ok: true,
            msg: 'login',
            uid: user._id,
            name: user.name,
            token
        })    

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Por favor, hable con el administrador"
        })
        
    }


    
}

const revalidateUser = async (req, res = response) => {

    const {uid,name} = req;

    const token = await generarJWT(uid,name);
    res.json({
        ok: true,
        token,
        uid,
        name
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateUser
}
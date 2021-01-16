const { respose, response } = require('express');
const Event = require('../models/Events-model');
// {
//     ok:true,
//     msg:'obtener eventos'
// }

const getEventos = async (req, res = response) => {
    const eventos = await Event.find().populate('user','name');

    res.status(400).json({
        ok: true,
        eventos
    });
}
const crearEvento = async (req, res = response) => {

    const evento = new Event(req.body);

    try {
        evento.user= req.uid;
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })


    } catch (error) {
        console.log(error);
        returnres.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

    //verificar que tenga el evento
    console.log(req.body);

    res.status(401).json({
        ok: true,
        msg: 'crear eventos'
    });
}
const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento= await Event.findById(eventoId);

        if(!evento){
            return res.status(404).json({
                ok:false,
                msg: 'Evento no existe con ese id'
            })
        }

        if(evento.user.toString()!==uid){
            return res.status(401).json({
                ok:false,
                msg:'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento ={
            ...req.body,
            user:uid
        }

        const eventoActualizado =await Event.findByIdAndUpdate(eventoId,nuevoEvento,{new: true});

        res.json({
            ok:true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: true,
            msg:'Hable con el administrador'
        });
    }
    
}
const eliminarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento= await Event.findById(eventoId);

        if(!evento){
            return res.status(404).json({
                ok:false,
                msg: 'Evento no existe con ese id'
            })
        }

        if(evento.user.toString()!==uid){
            return res.status(401).json({
                ok:false,
                msg:'No tiene privilegio de editar este evento'
            });
        }

        const eventoActualizado =await Event.findByIdAndDelete(eventoId);
        
        res.json({
            ok:true
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: true,
            msg:'Hable con el administrador'
        });
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
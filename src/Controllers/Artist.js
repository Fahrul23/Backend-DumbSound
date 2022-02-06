const {artist} = require('../../models/index')
const Joi = require('joi')

exports.getArtists = async (req, res) => {
    try {
        let artists = await artist.findAll({
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
        })

        res.status(200).send({
            message: "success",
            data: artists
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "internal server error"
        })
    }
}


exports.detailArtist = async (req, res) => {
    const {id} = req.params
    try {
        
        const result = await artist.findOne({
            where: {id},
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
        })

        if(!result) {
            res.status(404).send({
                message: "success",
                data: []
            })
        }

        res.status(200).send({
            message: "success",
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "internal server error"
        })
    }
}


exports.addArtist = async (req, res) => {
    const body = req.body
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        old: Joi.number().min(1).required(),
        type: Joi.string().min(1).required(),
        startCareer: Joi.number().required(),
    })
    const {error} = schema.validate(body)

    if(error) {
        return res.status(400).send({
            message: error.details[0].message
        })
    }
    try {
        const newArtist = await artist.create(body)
        const result = await artist.findOne({
            where: {id: newArtist.id},
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
        });
        res.status(201).send({
            message: "success",
            data: result
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "internal server error"
        })
    }
}

exports.editArtist = async (req, res) => {
    const body = req.body
    const {id} = req.params;
    const schema = Joi.object({
        name: Joi.string().min(3),
        old: Joi.number().min(1),
        type: Joi.string().min(1),
        startCareer: Joi.number(),
    })
    const {error} = schema.validate(body)

    if(error) {
        return res.status(400).send({
            message: error.details[0].message
        })
    }
    try {
        const result = await artist.findOne({
            where: {id},
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
        })
        
        if(!result) {
            return res.status(404).send({
                message: "Artist Not Found"
            })
        }
        
        await artist.update(body,{
            where: {id},
        });
        res.status(201).send({
            message: "success",
            data: result
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "internal server error"
        })
    }
}
exports.deleteArtist = async (req, res) => {
    const {id} = req.params;
    try{
        await artist.destroy({
            where: {id}
        })
        res.status(200).send({
            message: "success"
        })
    }catch (error) {
        console.log(error)
        res.status(500).send({
            message: "internal server error"
        })
    }
}
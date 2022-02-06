const { music, artist } = require('../../models/index')
const Joi = require('joi')
const {Op} = require('sequelize')

exports.getMusics = async (req, res) => {
  try {
    let musics = await music.findAll({
      include: [
        {
            model: artist,
            as: "artist",
            attributes: {
              exclude: ['createdAt','updatedAt']
            },
        }, 
      ],
      attributes: {
        exclude: ['artistId','createdAt','updatedAt']
      }
    })
    if(musics.length > 0) {
        let result = []
        musics.map(element => {
            let data = {
                title: element.title,
                name: element.artist.name,
                attache: element.attache,
                thumbnail: element.thumbnail,
                year: element.year,
            }
            result.push(data)
        })
        
        res.status(200).send({
            message: "success",
            data: result
        })
    }
    res.status(200).send({
        message: "success",
        data: musics
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).send({
        status: "failed",
        message: "internal server error"
    })    
  }
}
exports.detailMusic = async (req, res) => {
    const {id} = req.params;
    try {
      let result = await music.findOne({
        where: {id},
        include: [
          {
            model: artist,
            as: 'artist',
            attributes: {
              exclude: ['createdAt','updatedAt']
            }
          }
        ],
        attributes: {
          exclude: ['artistId','createdAt','updatedAt']
        }
      })
  
      if(!result) {
        return res.status(404).send({
          message: "Music Not Found"
        })
      }
  
      res.status(200).send({
        message: "success",
        data: result
      })
    } catch (error) {
      console.log(error.message)
      res.status(500).send({
          status: "failed",
          message: "internal server error"
      })
    }
}

exports.addMusic = async (req, res) => {
    const artistId =  req.body.artistId
    const title =  req.body.title
    const year =  req.body.year
    const schema = Joi.object({
        artistId: Joi.required(),
        title: Joi.string().min(3).required(),
        year: Joi.number().min(4).required(),
    })
  
    const {error} = schema.validate({artistId, title, year})
      if(error) {
          return res.status(400).send({
              message: error.details[0].message
          })
      }
      try {
        const newMusic = await music.create({
            artistId,
            title,
            year,
            thumbnail: req.files[0].filename,
            attache: req.files[1].filename,
        })
  
        res.status(201).send({
            status: "success",
            data: newMusic
        })
  
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
}

exports.editMusic = async (req, res) => {
    const {id, artistId} = req.params
    try {
        const musicExist = await music.findOne({
            where: {id}
        })

        if(!musicExist) {
            return res.status(404).send({
                status: "error",
                message: "Music not found"
            })   
        }
        let thumbnail = ''
        let attache = ''
        if(req.files.length > 0){
            if(req.files[1]){
                if(req.files[0].fieldname === "thumbnail"){
                    thumbnail = req.files[0].filename
                }
                else{
                    thumbnail = req.files[1].filename
                }
                
                if(req.files[0].fieldname === "attache"){
                    attache = req.files[0].filename
                }
                else{
                    attache = req.files[1].filename
                }
            }else if(req.files[0]){
                if(req.files[0].fieldname === "thumbnail"){
                    thumbnail = req.files[0].filename
                }
                else{
                    thumbnail = musicExist.thumbnail
                }

                if(req.files[0].fieldname === "attache"){
                    attache = req.files[0].filename
                }
                else{
                    attache = musicExist.attache
                }
            }
        }else {
            thumbnail = musicExist.thumbnail
            attache = musicExist.attache
        }
        
        await music.update({
            artistId,
            title : req.body.title,
            year: req.body.year,
            thumbnail,
            attache
        },{
            where: {id}
        })

        let result = await music.findOne({
            where: {id},
            include: [
              {
                model: artist,
                as: 'artist',
                attributes: {
                  exclude: ['createdAt','updatedAt']
                }
              }
            ],
            attributes: {
              exclude: ['artistId','createdAt','updatedAt']
            }
        })

        res.status(200).send({
            status: "success",
            data: result
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })  
    }
}

exports.deleteMusic = async (req, res) => {
    const {id} = req.params
    try {
        let result = await music.findOne({
            where: {id}
        })
        if(!result) {
            return res.status(404).send({
                message: "Music Not Found"
            })
        }
        await music.destroy({
            where: {id}
        })
        res.status(200).send({
            message: "success"
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
}


exports.searchMusic = async (req, res) => {
    const keyword = req.body.keyword
    try {
        const result = await music.findAll({
            where: {
                title: {
                    [Op.substring]: keyword
                }
            },
            include: [{
                model: artist,
                as: 'artist'
            }]

        })

        if(result.length > 0) {
            let musics = []
            result.map(element => {
                let data = {
                    title: element.title,
                    name: element.Artist.name,
                    attache: element.attache,
                    thumbnail: element.thumbnail,
                    year: element.year
                }
                musics.push(data)
            })
            res.status(200).send({
                message: "success",
                data: musics
            })
        }else {
            return res.status(404).send({
                message: "music not found"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "internal server error"
        })        
    }
}

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
        let response = []
        musics.map(element => {
            let data = {
                title: element.title,
                name: element.artist.name,
                attache: element.attache,
                thumbnail: element.thumbnail,
                year: element.year,
            }
            response.push(data)
        })
        
        res.status(200).send({
            message: "success",
            data: response
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

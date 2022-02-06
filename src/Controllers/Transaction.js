const {transaction, user} = require('../../models/index')
const Joi = require('joi')

exports.getTransaction = async (req, res) => {
  try {
    let result = await transaction.findAll({
      include: [
        {
            model: user,
            as: "user",
            attributes: {
              exclude: ['password','createdAt','updatedAt']
            },
        }, 
      ],
      attributes: {
        exclude: ['userId','createdAt','updatedAt']
      }
    })
    res.status(200).send({
      message: "success",
      data: result
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
        status: "failed",
        message: "internal server error"
    })    
  }
}

exports.detailTransaction = async (req, res) => {
    const {id} = req.params;
    try {
        let result = await transaction.findOne({
            where: {id},
            include: [
            {
                model: user,
                as: 'user',
                attributes: {
                exclude: ['password','createdAt','updatedAt']
                }
            }
            ],
            attributes: {
            exclude: ['userId','createdAt','updatedAt']
            }
        })
  
        if(!result) {
            return res.status(404).send({
            message: "Transaction Not Found"
            })
        }
  
        res.status(200).send({
            message: "success",
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
}

exports.transactionByUserId = async (req, res) => {
    const userId = req.user.id
    try {
        let result = await transaction.findOne({
            where: {userId},
            include: [
            {
                model: user,
                as: 'user',
                attributes: {
                exclude: ['password','createdAt','updatedAt']
                }
            }
            ],
            attributes: {
            exclude: ['userId','createdAt','updatedAt']
            }
        })
  
        if(!transaction) {
            return res.status(404).send({
                message: "Transaction Not Found",
                data: []
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

exports.addTransaction = async (req, res) => {
    const userId =  req.body.userId
    const schema = Joi.object({
        userId: Joi.number().required(),
    })
    const {error} = schema.validate({userId})
    if(error) {
        return res.status(400).send({
            message: error.details[0].message
        })
    }
    try {

        const transactionExist = await transaction.findOne({
            where: {userId}
        })

        if(transactionExist){
            await transaction.update({
                startDate: null,
                endDate: null,
                status: "pending"
            },{
                where: {id: transactionExist.id}
            })
            return res.status(201).send({
                    status: "success",
                    data: transactionExist
                })
        }


        const newTransaction = await transaction.create({
            userId,
            attache: req.files[0].filename,
        })
  
        res.status(201).send({
            status: "success",
            data: newTransaction
        })
  
    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
}


exports.approveTransaction = async (req, res) => {
    const {transactionId} = req.params
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    
    try {
        let result = await transaction.findOne({
            where: {id: transactionId}
        })
        if(!result) {
            return res.status(404).send({
                message: "Transaction not found"
            })
        }

        await transaction.update({
            startDate,
            endDate,
            status: "success"
        },{
            where: {id: transactionId}
        })

        let data = await transaction.findOne({
            where: {id : transactionId},
            include: [
              {
                model: user,
                as: 'user',
                attributes: {
                  exclude: ['password','createdAt','updatedAt']
                }
              }
            ],
            attributes: {
              exclude: ['userId','createdAt','updatedAt']
            }
        })
        await user.update({
            subscribe: true
        }, {
            where: {id: data.user.id}
        })

        res.status(200).send({
            message: "success",
            data
        })

        

    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
}

exports.cancelTransaction = async (req, res) => {
    const {transactionId} = req.params
    try {

        let result = await transaction.findOne({
            where: {id: transactionId}
        })
        if(!result) {
            return res.status(404).send({
                message: "Transaction not found"
            })
        }

        await transaction.update({
            startDate : null,
            endDate: null,
            status: "cancel"
        },{
            where: {id: transactionId}
        })

        let data = await transaction.findOne({
            where: {id : transactionId},
            include: [
              {
                model: user,
                as: 'user',
                attributes: {
                  exclude: ['password','createdAt','updatedAt']
                }
              }
            ],
            attributes: {
              exclude: ['userId','createdAt','updatedAt']
            }
        })

        await user.update({
            subscribe: false
        }, {
            where: {id: data.user.id}
        })

        res.status(200).send({
            message: "success",
            data
        })


    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
}

exports.deleteTransaction = async (req, res) => {
    const {id} = req.params
    try {
        let result = await transaction.findOne({
            where: {id}
        })
        if(!result) {
            return res.status(404).send({
                message: "Transaction Not Found"
            })
        }
        await transaction.destroy({
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

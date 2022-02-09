const {user} = require('../../models/index')
const Joi = require('joi')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

exports.Login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // Validate input user
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    const {error} = schema.validate({email,password})

    if(error){
        return res.status(400).send({
            status: "failed",
            message: error.details[0].message
        })
    }

    try {
        const userExist = await user.findOne({
            where: {email},
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
        })
        if(!userExist){
            return res.status(400).send({
                status: "failed",
                message: "email doesnt exist"
            })
        }

        // Password Validate with bcrypt
        const passwordCheck = await bcrypt.compare(password,userExist.password)
        
        if(!passwordCheck){
            return res.status(400).send({
                status: "failed",
                message: "password doesnt exist"
            })
        }

        // create Token JWT
        const dataToken = {id: userExist.id}

        var token = jwt.sign(dataToken, process.env.API_KEY);

        res.status(200).send({
            message: "success",
            data : {
                id: userExist.id,
                fullName: userExist.fullName,
                email: userExist.email,
                role: userExist.role,
                subscribe: userExist.subscribe,
                token    
            }
            
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })    
    }
}

exports.Register = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const fullName = req.body.fullName
    const phone = req.body.phone
    const gender = req.body.gender
    const address = req.body.address
    const listAs = req.body.listAs
    const role = listAs > 0 ? "admin" : "member"
    // Validate input user
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        fullName: Joi.string().min(3).required(),
        phone: Joi.number().min(10).required(),
        gender: Joi.string().min(3).required(),
        address: Joi.string().min(3).required(),
    })
    
    const {error} = schema.validate({
        email,
        password,
        fullName,
        phone,
        gender,
        address,
    })

    if(error){
        return res.status(400).send({
            status: "failed",
            message: error.details[0].message
        })
    }
    
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const emailExist = await user.findOne({
            where: {email}
        })

        if(emailExist){
            return res.status(400).send({
                message: "Email already exists"
            })
        }
        const newUser = await user.create({
            fullName, 
            email,
            phone,
            gender,
            address,
            role,
            password: hashedPassword
        })

        // create Token JWT
        const dataToken = {id: newUser.id}
        var token = jwt.sign(dataToken,process.env.API_KEY)

        res.status(201).send({
            message: "success",
            data : {
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
                subscribe: false,
                token    
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })       
    }
    
}
exports.checkAuth = async (req, res) => {
    try {
        
        const dataUser = await user.findOne({
            where: { id : req.user.id },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });
  
        if (!dataUser) {
            return res.status(404).send({
            status: "failed",
            });
        }
  
        res.status(200).send({
            status: "success...",
            data: {  
                id: dataUser.id,
                name: dataUser.fullName,
                email: dataUser.email,
                role: dataUser.role,
                subscribe: dataUser.subscribe
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
  };
  
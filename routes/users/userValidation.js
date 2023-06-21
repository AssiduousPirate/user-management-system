const { Joi } = require("../../utils/validate")

const getUsers = Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number(),
    user_id: Joi.number(),
    text: Joi.string(),
})

const createUser = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    age: Joi.number().required(),
    image: Joi.string(),
    city: Joi.string().required()
})

const updateUser = Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string(),
    email: Joi.string(),
    age: Joi.number(),
    image: Joi.string(),
    city: Joi.string()
})

const deleteUser = Joi.object().keys({
    id: Joi.number().required()
})

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}
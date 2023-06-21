const express = require('express')
const router = express.Router()
const userController = require("./userController")
const Validation = require("./userValidation")
const { validate } = require("../../utils/validate")
const { upload } = require("../../utils/upload")

router.get(
    "/api/v1/get/users",
    validate(Validation.getUsers, "query"),
    userController.getUsers
)

router.post(
    "/api/v1/create/user",
    upload.single('image'),
    validate(Validation.createUser),
    userController.createUsers
)

router.put(
    "/api/v1/update/user/:id",
    upload.single('image'),
    validate(Validation.updateUser, "params"),
    userController.updateUsers
)

router.delete(
    "/api/v1/delete/user/:id",
    validate(Validation.deleteUser, "params"),
    userController.deleteUsers
)

module.exports = router
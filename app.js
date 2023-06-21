const createError = require("http-errors")
const express = require("express")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const { readPool, writePool } = require("./utils/database")
const cors = require("cors")
require("dotenv").config()

const { __ } = require("./lib/i18n/language")
const { Response } = require("./lib/Http-Responses")

global.readPool = readPool
global.writePool = writePool

const YAML = require("yamljs")
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = YAML.load("./docs/swagger.yaml")

var app = express()

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({
	origin: "*"
}))

app.use(function(req, res, next){
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Request-With, Content-Type, Accept, Authorization"
		)
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE, OPTIONS"
		)
	res.setHeader("Access-Control-Allow-Credentials", true)
	if (res.method == "OPTIONS") {
		return res.status("204").send("OK")
	}
	next()
})

app.use(function(req, res, next){
	req.__ = __
	for(const method in Response){
		if (Response.hasOwnProperty(method)) res[method] = Response[method]
	}
    next()
})

app.use(methodOverride())

app.use("/", require("./routes"))

app.use(function(req, res, next){
	return res.notFound(null, "Invalid URL!")
})

module.exports = app
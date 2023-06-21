var app = require("../app")
var debug = require("debug")
var https = require("https")
var http = require("http")
const fs = require("fs")
const path = require("path")

var port = normalizePort(process.env.PORT || '3001')
app.set('port', port)

var server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val){
	var port = parseInt(val, 10)
	if(isNaN(port)){
		return val
	}

	if (port >= 0) {
		return port
	}

	return false
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }
    var bind = typeof server.address() === 'string'
        ? 'Pipe ' + server.address()
        : 'Port ' + server.address().port
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}
function onListening(){
	var addr = server.address()
	var bind = typeof addr === 'string'
	    ? 'pipe' + addr
	    : 'port' + addr.port

	    debug('Listening on' + bind)

}
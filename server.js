var express = require('express')
var conf = require('./creds.json').lights
var proc = require('child_process')

var app = express()

app.use(express.static(__dirname + '/client'));

app.post('/lights/:status', function (req, res) {
	var status = req.params.status

	if (status == "on") {
		console.log("Setting light on...")
		proc.execSync(`curl -v -X POST -d "output=1" -b "AIROS_SESSIONID=${conf.AIROS_SESSIONID}" ${conf.ip}/sensors/1`)
		proc.execSync(`curl -v -X POST -d "output=1" -b "AIROS_SESSIONID=${conf.AIROS_SESSIONID}" ${conf.ip}/sensors/4`)
	} else if (status == "off") {
		console.log("Setting light off...")
		proc.execSync(`curl -v -X POST -d "output=0" -b "AIROS_SESSIONID=${conf.AIROS_SESSIONID}" ${conf.ip}/sensors/1`)
		proc.execSync(`curl -v -X POST -d "output=0" -b "AIROS_SESSIONID=${conf.AIROS_SESSIONID}" ${conf.ip}/sensors/4`)

	} else {
		res.status(400).send("Incorrect light status, must be on|off")
		return
	}

	console.log("Lights set to " + status)
	res.send('Lights set to ' + status)
})

app.listen(8080)
console.log("== Server started ==")

console.log("== Connecting to lights ==")
proc.execSync(`curl -v -X POST -d "username=${conf.login}&password=${conf.password}" -b "AIROS_SESSIONID=${conf.AIROS_SESSIONID}" ${conf.ip}/login.cgi`)
console.log("== Connected to lights ==")

console.log("== Testing call to sensors ==")
proc.execSync(`curl -v -X GET -b "AIROS_SESSIONID=${conf.AIROS_SESSIONID}" ${conf.ip}/sensors`)
console.log("== Connection working ==")

console.log("== Server ready ==")
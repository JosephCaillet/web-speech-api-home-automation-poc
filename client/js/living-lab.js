var sandboxMode = false

var Camera = {
	zones: {
		ENTRANCE: "entrance",
		TV: "tv",
		SOFA: "sofa",
		KITCHEN: "kitchen",
		BED: "bed",
		DOWN: "down"
	},

	moveCamera: zone => {
		if (sandboxMode) {
			return Promise.resolve()
		}
		return new Promise((ok, ko) => {
			console.log(Camera.zones)
			console.log(zone)
			console.log(Camera.zones[zone])
			var url = `http://${Creds.camera.ip}/axis-cgi/com/ptz.cgi?gotoserverpresetname=${zone}&camera=1`
			$.get(url)
				.done(() => {
					ok()
				})
				.fail(err => {
					ko(err)
				})
		})
	}
}

var Temperature = {
	fetch: () => {
		if (sandboxMode) {
			return Promise.resolve(20)
		}
		return new Promise((ok, ko) => {
			var url = `http://${Creds.temperature.ip}/php/read-sensor.php?name=Temperature`
			$.getJSON(url)
				.done(data => {
					ok(data.value)
				})
				.fail(err => {
					ko(err)
				})
		})
	}
}

var Lights = {
	turn: status => {
		if (sandboxMode) {
			return Promise.resolve()
		}
		return new Promise((ok, ko) => {
			var url = `/lights/${status}`
			$.post(url)
				.done(data => {
					ok(data.value)
				})
				.fail((...err) => {
					ko(err)
				})
		})
	}
}
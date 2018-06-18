var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var SpeechSynthesis = window.speechSynthesis;
var synthVoiceFr

var intents = [
	{
		name: "lights",
		pattern: /(allume|étein.) la lumière/,
		action: matches => {
			if (matches[1] == "allume") {
				$(".light").addClass("on")
				setSpeechOut("Lumiére allumée.")
				return
			}
			setSpeechOut("Lumiére éteinte.")
			$(".light").removeClass("on")
		}
	},
	{
		name: "heating",
		pattern: /(allume|étein.) le chauffage/,
		action: matches => {
			if (matches[1] == "allume") {
				$(".heating").addClass("on")
				setSpeechOut("Chaufage allumée.")
				return
			}
			setSpeechOut("Chaufage éteint.")
			$(".heating").removeClass("on")
		}
	},
	{
		name: "temperature-fetch",
		pattern: /(quelle est la température)|(combien fait-il)/,
		action: () => {
			setSpeechOut("Il fait 20°C.")
		}
	},
	{
		name: "camera-move",
		pattern: /(?:(?:regarde)|(?:déplace la caméra vers)) ((?:l'entrée)|(?:la télévision)|(?:le canapé)|(?:la cuisine)|(?:le lit)|(?:le sol))/,
		action: matches => {
			$(".video div").removeClass("on")
			console.log(4, matches[1])
			switch (matches[1]) {
				case "l'entrée":
					setSpeechOut("Camera déplacée vers l'entrée.")
					$(".zone-entrance").addClass("on")
					break
				case "la télévision":
					setSpeechOut("Camera déplacée vers la TV.")
					$(".zone-tv").addClass("on")
					break
				case "le canapé":
					setSpeechOut("Camera déplacée vers le canapé.")
					$(".zone-sofa").addClass("on")
					break
				case "la cuisine":
					setSpeechOut("Camera déplacée vers la cuisine.")
					$(".zone-kitchen").addClass("on")
					break
				case "le lit":
					setSpeechOut("Camera déplacée vers le lit.")
					$(".zone-bed").addClass("on")
					break
				case "le sol":
					setSpeechOut("Camera déplacée vers le sol.")
					$(".zone-down").addClass("on")
					break
			}
		}
	},
]

// let r = "déplace la caméra vers le lit".match(intents[3].pattern)
// console.log(r)

window.onload = () => {
	$(".light, .heating, .video div").click(e => $(e.target).toggleClass("on"))
	$(".info-button, .about-modal-close").click(() => {
		$(".about-modal").toggleClass("active")
		if($(".easteregg").hasClass("active")) {
			setSpeechOut("Vous avez aimé ?")
		}
		$(".easteregg").html("").removeClass("active")
	})

	$.ajax({
		url: "grammar_fr.jsgf",
		success: (data) => setupRecognition(data)
	});

	synthVoiceFr = SpeechSynthesis.getVoices().filter(l => l.lang == "fr-FR")[0]
}

function setupRecognition(jsgf) {
	var lexicon = new SpeechGrammarList()
	lexicon.addFromString(jsgf)

	var recognition = new SpeechRecognition()
	recognition.grammars = lexicon
	recognition.continuous = false;
	recognition.lang = 'fr-FR';
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;

	recognition.onstart = () => console.log('start')
	recognition.onend = () => {
		console.log('end')
		$(".microphone").removeClass("active")
	}

	// recognition.onspeechstart = () => console.log('speech start')
	// recognition.onspeechend = () => console.log('speech end')

	// recognition.onsoundstart = () => console.log('sound start')
	// recognition.onsoundend = () => console.log('sound end')

	// recognition.onaudiostart = () => console.log('audio start')
	// recognition.onaudioend = () => console.log('audio end')

	recognition.onnomatch = () => {
		console.warn('no match')
		setSpeechIn('No match')
	}
	recognition.onerror = e => {
		console.error('error', e)
		setSpeechIn(e.error)
	}
	recognition.onresult = e => {
		let transcript = e.results[0][0].transcript
		console.log('result', e, transcript)
		setSpeechIn(transcript)
		checkIntents(transcript)
	}

	$(".microphone").click(() => {
		if ($(".microphone").hasClass("active")) {
			recognition.abort()
			$(".microphone").removeClass("active")
			return
		}
		$(".microphone").addClass("active")
		recognition.start()
	})
}

function checkIntents(transcript) {
	for (let intent of intents) {
		let matches = transcript.match(intent.pattern)
		if (matches) {
			intent.action(matches)
			console.log("matched: " + intent.name)
			// console.log(matches)
			return
		}
	}
	setSpeechOut("Désolé, je n'ai pas compris.")
	console.warn("Unknonw intent")
}

function setSpeechIn(inputText) {
	$('.speech-in').html(inputText || "&nbsp;")
}

function setSpeechOut(outputText) {
	$('.speech-out').html(outputText || "&nbsp;")

	var speechUtterance = new SpeechSynthesisUtterance(outputText)
	speechUtterance.voice = synthVoiceFr
	// speechUtterance.pitch = pitch.value;
	// speechUtterance.rate = rate.value;
	SpeechSynthesis.speak(speechUtterance);
}

function setUpEasterEgg() {
	intents = intents.concat([
		{
			name: "eddy malou",
			pattern: /congolexicomatisation des lois du marché/,
			action: () => {
				setSpeechOut("Mais oui c'est clair !")
			}
		},
		{
			name: "sebp",
			pattern: /fait tourner les serviettes/,
			action: () => {
				setSpeechOut("Ok, je met de la bonne musique.")
				setTimeout(() => unicorn('sebp'), 1000)
			}
		},
		{
			name: "rick",
			pattern: /Comment avoir 20 sur 20 au projet de recherche bibliographique/i,
			action: () => {
				setSpeechOut("Humm...")
				setTimeout(() => unicorn('rick'), 500)
			}
		},
	])
}

function unicorn(type) {
	var rick = '<iframe width="853" height="480" src="https://www.youtube-nocookie.com/embed/DLzxrzFCyOs?rel=0?&autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
	var sebp = '<iframe width="853" height="480" src="https://www.youtube-nocookie.com/embed/kk2CzGfL7n4?rel=0&autoplay=1&start=37" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
	var eddy = '<iframe width="853" height="480" src="https://www.youtube-nocookie.com/embed/6sDvu1biXFU?rel=0&autoplay=1&start=47" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
	var html

	switch (type) {
		case "rick":
			html = rick
			break
		case "sebp":
			html = sebp
			break
		case "eddy":
			html = eddy
			break
	}
	$(".easteregg").html(html)
	$(".easteregg, .about-modal").addClass("active")
}

setUpEasterEgg()
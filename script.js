window.onload = () => {
	$(".light, .temperature, .video div").click(e => $(e.target).toggleClass("on off"))
	$(".microphone").click(() => $(".microphone").toggleClass("active"))
	$(".info-button, .about-modal-close").click(() => $(".about-modal").toggleClass("active"))
}
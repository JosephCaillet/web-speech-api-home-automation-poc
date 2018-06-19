# web-speech-api-home-automation-poc
A poc to automate some devices in ISEN Brest living lab, using the web speech api.

## Requirements and limitations
* A web browser supporting ES6 is required.
* Currently (june 2018) only Chrome implements the recognition part of the web speech api.
* The code can work in sandbox mode: it will not contact any api at all, the living lab will remain unaffected.
* Thermometer and camera api are directly called by the web browser, so you may need to use a browser extension that add cors header on the fly.
* The code must be served by a web server to work in chrome. A minimal node js server script doing this is provided. This script also handles lights api request.
* The part contacting the living lab for real, when not in sandbox mode, is sometime inconsistant. Please remember that this poc is a poc.
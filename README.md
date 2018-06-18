# web-speech-api-home-automation-poc
A poc to automate some devices in ISEN Brest living lab, using the web speech api.

## Requirements and limitations
* Currently (june 2018) only Chrome implements the recognition part of the web speech api.
* The code must be served by a web server to work in chrome. A minimal static file server is enough, [caddy](https://caddyserver.com/) is perfect for that usage.
* A web browser supporting ES6 is required
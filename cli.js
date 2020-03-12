var noble = require("noble");
var pjson = require('./package.json');
var program = require('commander');

var braceletDevice = require('./lib/braceletDevice.js');

program
	.version(pjson.version)
	.description(pjson.description)
	.option('-b, --battery', 'print battery level')
	.option('-v, --softwareversion', 'print software version')
	.option('-f, --manufacturer', 'print manufacterer')
	.option('-m, --model', 'print modelname')
	.option('-t, --touch', 'read single touchvalue')
	.option('-s, --subscribe', 'receive touch events')
	.option('-q, --squeeze', 'Squeeze bracelet')
	.option('-r, --repeat', 'repeat commands every second')
	.action(handleCommands)
	.parse(process.argv);

function handleCommands() {
	console.log("Searching Bracelet device..");
	bracelet = new braceletDevice();

	bracelet.connect((err, address) => {
		if(err) {
			console.log(err.message);
			process.exit(1);
		}

		console.log("connected to "+address);
		function execute() {
			if(program.subscribe) {	
				bracelet.enableTouchNotifications(()=> {});

				bracelet.on('touch', (id, value) => {
					console.log("touch event => id: "+id+" touchval: "+value);
				});
			}
			
			if(program.model) {
				bracelet.getModelName((error, data) => {
					console.log("Model: "+data);
				});
			}
		
			if(program.battery) {
				bracelet.getBatteryLevel((error, data) => {
					console.log("batterylevel: "+data);
				});
			}

			if(program.touch) {
				bracelet.getTouchValue((error, id, value) => {
					console.log("touch value => id: "+id+" touchval: "+value);
				});
			}
			
			if(program.softwareversion) {
				bracelet.getSoftwareVersion((error, data) => {
					console.log("SW version: "+data);
				});
			}
			
			if(program.manufacturer) {
				bracelet.getManufacturer((error, data) => {
					console.log("manufacturer: "+data);
				});
			}

			if(program.squeeze) {
				bracelet.squeeze((error) => {
					console.log("Squeeze");
				});
			}
		}

		if(program.repeat) {
			setInterval(() => {
				execute();
			}, 1000);
		} else {
			execute();
		}
	});
}

var noble = require("noble");
var braceletDevice = require('./lib/braceletDevice.js');

const BLUETOOTH_NAME = 'HEY! Bracelet';
const BLUETOOTH_MANUFACTURER = '4c0010020b00'
const SQUEEZE_INTERVAL = 2000;

const BATTERY_RANGE_MIN = 20;
const BATTERY_RANGE_MAX = 100;

noble.on('stateChange', (state) => {
	_state = state;
	if(_state === 'poweredOn') {
		noble.startScanning();
	} else {
		noble.stopScanning();
		throw new Error("Bluetooth is disabled. Check if bluetooth is on");
	}
});

console.log("searching for devices..");

noble.on('discover', (peripheral) => {
	if(peripheral.advertisement.localName === BLUETOOTH_NAME) {
		// check in logs if device is already tested
		let device = new braceletDevice(peripheral);

		device.connect((error) => {
			if(error) {
				return console.error("could not connect to discovered device with address: "+device.peripheral.address);
			}
			console.log("starting test on device "+ device.peripheral.address);
			run_test(device).then((passed) => {
				if(passed) {
					console.log("device "+ device.peripheral.address +" passed!");
				} else {
					console.error("device "+ device.peripheral.address +" failed..");
				}
			});
		});
	}
});

async function run_test(device) {
	// start moving
	device.startContinuousSqueeze(SQUEEZE_INTERVAL);
	// wait for touch signal
	try {
		await test_touch(device, true);
		console.log("device "+device.peripheral.address+" is touched");
	} catch(error) {
		console.error("error: "+error);
	}
	// check battery value
	try {
		let res = await test_battery(device);
		if(res) {
			// test passed!
			device.stopContinuousSqueeze();
			device.disconnect();

			delete device;
			return true;
		}	
	} catch(error) {
		console.error("errorb: "+error);
	}
	// test failed
	return false;
}

async function test_touch(device, touchIsHigh) {
	return new Promise((resolve, reject) => {
		device.enableTouchNotifications((error) => {
			if(error) {
				return reject(false);
			}

			device.on('touch', (id, value) => {
				if(touchIsHigh) {
					if(value > 0) {
						resolve(true);
					}
				} else {
					if(value <= 0) {
						resolve(true);
					}
				}
			});
		});
	});
}

async function test_battery(device) {
	return new Promise((resolve, reject) => {
		device.getBatteryLevel((error, value) => {
			if(error) { 
				return reject(false);
			}

			// check if battery value is ok
			if(value < BATTERY_RANGE_MAX && value > BATTERY_RANGE_MIN) {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
}

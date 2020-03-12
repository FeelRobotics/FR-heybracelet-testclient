# Hey! Bracelet testsuite

The Hey! Bracelet testsuite provides tools to interface and test the Hey! Bracelet devices. libraries and apps are written in Javascript (Node.js).

## Prerequisites

* Node.Js = 8.x
* npm

## Installing

Clone the repository recursively in order to fetch the submodules as well:

```
git clone git@github.com:FeelRobotics/hey-bracelet-testsuite.git
```
install dependencies
```
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```
link node.js to node 
```
sudo ln -s /usr/bin/nodejs /usr/bin/node
```
Run npm install inside the root directory
```
npm install
```


## Using the cli-tool

After the installation you can run the application using the following command:
```
sudo node cli.js <opts>
```

or for the test_app
```
sudo node run_test.js
```

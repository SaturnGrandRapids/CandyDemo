# CandyDemo
The software side of an IoT enable candy dispenser that can be activated via an Alexa trivia skill

The CandyDispsenser itself is controlled via a webservice. This service opperates by using Amazon's AWS API Gateway to map a POST (with json data) from a URL to an AWS Lmabda function (code for lambda included). This lambda is used to add data to an AWS IoT MQTT message queue. A python script on a Raspberry Pi (code included) subscribes to that queue, and does a minor bit of decoding and then signals an Arduino which has Wiring code (included) to control the actual hardware.

The code that interacts with the AWS IoT queue (RaspberryPi and the Candy Dispenser Servie Lamda) requires the Python AWS IoT SDK

Because this is a web service, it can also be called from our Alexa skill trivia program.


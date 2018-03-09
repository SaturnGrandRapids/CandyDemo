from __future__ import print_function

print('Loading function')




from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import sys
import logging
import time
import getopt
import json


def initializeClient():
    # Init AWSIoTMQTTClient
    #myAWSIoTMQTTClient = AWSIoTMQTTClient(clientName)
    myAWSIoTMQTTClient.configureEndpoint(host, 8883)
    myAWSIoTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

    # AWSIoTMQTTClient connection configuration
    myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
    myAWSIoTMQTTClient.configureOfflinePublishQueueing(1)  # Infinite offline Publish queueing
    #myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
    myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
    myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec


def connectToMQQTQueue():
    initializeClient()
    myAWSIoTMQTTClient.connect()

def sendMessage(messageBody):
    print("connecting")
    connectToMQQTQueue()
    print("sending")
    myAWSIoTMQTTClient.publish(queueName, messageBody, 1)
    print("disconnecting")
    time.sleep(2)
    myAWSIoTMQTTClient.disconnect()


# Read in command-line parameters
host = "a1aqp5k4egmmfe.iot.us-west-2.amazonaws.com"
rootCAPath = "VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem"
certificatePath = "39f1efa5e5-certificate.pem.crt"
privateKeyPath = "39f1efa5e5-private.pem.key"
clientName = "candyService"
queueName = "sdk/test/Python"
myAWSIoTMQTTClient =  AWSIoTMQTTClient(clientName)


#sendMessage("new static message")


def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    print("Candy Selected" + event['candyType'])
    print("Sending message to queue")
    sendMessage(event['candyType'])
    return event['candyType']  # Echo back the first key value
    
    
    



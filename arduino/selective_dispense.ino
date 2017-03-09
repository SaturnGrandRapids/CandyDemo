#include <Servo.h>


Servo bin1Servo;
Servo bin2Servo;
Servo bin3Servo;

int binClose = 0;
int binOpen = 180;

int dispenseDelay = 3000;

int bin1Trigger = 5;
int bin2Trigger = 6;
int bin3Trigger = 7;


void setup() {
    //pinMode(LED_BUILTIN, OUTPUT);

    bin1Servo.attach(9);  // attaches the servo on pin 9 to the servo object
    bin2Servo.attach(10);
    bin3Servo.attach(11);

    bin1Servo.write(binClose);
    bin2Servo.write(binClose);
    bin3Servo.write(binClose);

    pinMode(bin1Trigger, INPUT);
    pinMode(bin2Trigger, INPUT);
    pinMode(bin2Trigger, INPUT);
    


    delay(1000); //pause on starting up in case power isn't applied perfectly evenly.
}

void loop() {
  if (digitalRead(bin1Trigger) == HIGH){
    bin1Servo.write(binOpen);
    delay(dispenseDelay);
    bin1Servo.write(binClose);
  } else if (digitalRead(bin2Trigger) == HIGH) {
    bin2Servo.write(binOpen);
    delay(dispenseDelay);
    bin2Servo.write(binClose);
  } else if (digitalRead(bin3Trigger) == HIGH){
    bin3Servo.write(binOpen);
    delay(dispenseDelay);
    bin3Servo.write(binClose);    
  }
}

#include <Arduino.h>
#include <IRremote.hpp>

#define PIN_IR 10

unsigned long ultimoPing = 0;
const unsigned long INTERVALO_PING = 2000;

void setup() {
  delay(2000);
  Serial.begin(9600);
  Serial.println();
  Serial.println("INIT");
  
  IrReceiver.begin(PIN_IR, ENABLE_LED_FEEDBACK);
  ultimoPing = millis();
}

void loop() {
  if (IrReceiver.decode()) {
    
    if (!(IrReceiver.decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT)) {
        
        uint32_t codigoHEX = IrReceiver.decodedIRData.decodedRawData;
        
        if (codigoHEX != 0) {
            char buffer[10];
            sprintf(buffer, "%08lX", codigoHEX);
            
            Serial.println(buffer);
            ultimoPing = millis();
        }
    }
    IrReceiver.resume();
  }

  if (millis() - ultimoPing >= INTERVALO_PING) {
    Serial.println("PING");
    ultimoPing = millis();
  }
}
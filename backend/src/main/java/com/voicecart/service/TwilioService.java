package com.voicecart.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
public class TwilioService {

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    public void sendOrderConfirmationSms(String toPhoneNumber, String orderNumber, BigDecimal totalAmount) {
        if ("YOUR_TWILIO_PHONE_NUMBER".equals(twilioPhoneNumber)) {
            log.warn("Twilio credentials not set. Simulating SMS sending...");
            log.info("SMS to {}: VoiceCart: Your order #{} has been placed successfully. Total: ₹{}. Thank you!", 
                    toPhoneNumber, orderNumber, totalAmount);
            return;
        }

        try {
            String messageBody = String.format("VoiceCart: Your order #%s has been placed successfully. Total: ₹%s. Thank you!",
                    orderNumber, totalAmount.toString());

            Message message = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    messageBody
            ).create();

            log.info("SMS sent successfully. SID: {}", message.getSid());
        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", toPhoneNumber, e.getMessage());
        }
    }
}

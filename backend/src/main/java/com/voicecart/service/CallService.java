package com.voicecart.service;

import com.voicecart.model.CallLog;
import com.voicecart.repository.CallLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CallService {

    private CallLogRepository callLogRepository;

    public CallLog registerIncomingCall(String callSid, String customerPhone) {
        CallLog callLog = callLogRepository.findByCallSid(callSid).orElse(null);
        if (callLog == null) {
            callLog = new CallLog();
            callLog.setCallSid(callSid);
            callLog.setCustomerPhone(customerPhone);
            callLog.setStatus(CallLog.CallStatus.RINGING);
            return callLogRepository.save(callLog);
        }
        return callLog;
    }

    public List<CallLog> getActiveCalls() {
        return callLogRepository.findActiveCalls();
    }

    public CallLog endCall(Long callId) {
        CallLog callLog = callLogRepository.findById(callId)
                .orElseThrow(() -> new RuntimeException("Call not found"));
        
        callLog.setStatus(CallLog.CallStatus.COMPLETED);
        callLog.setEndedAt(LocalDateTime.now());
        return callLogRepository.save(callLog);
    }
    
    public CallLog updateCallStatus(Long callId, CallLog.CallStatus status) {
        CallLog callLog = callLogRepository.findById(callId)
                .orElseThrow(() -> new RuntimeException("Call not found"));
        callLog.setStatus(status);
        return callLogRepository.save(callLog);
    }

    public CallService(CallLogRepository callLogRepository) {
        this.callLogRepository = callLogRepository;
    }

    public CallLogRepository getCallLogRepository() {
        return this.callLogRepository;
    }

    public void setCallLogRepository(CallLogRepository callLogRepository) {
        this.callLogRepository = callLogRepository;
    }

}

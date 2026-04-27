package com.voicecart.controller;

import com.voicecart.model.CallLog;
import com.voicecart.service.CallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calls")
@RequiredArgsConstructor
public class CallController {

    private final CallService callService;

    @PostMapping(value = "/incoming", produces = MediaType.APPLICATION_XML_VALUE)
    public String handleIncomingCall(@RequestParam(value = "From", required = false) String from,
                                     @RequestParam(value = "CallSid", required = false) String callSid) {
        if (from != null && callSid != null) {
            callService.registerIncomingCall(callSid, from);
        }

        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
               "<Response>\n" +
               "  <Say>Connecting you to an agent...</Say>\n" +
               "  <Enqueue>support_queue</Enqueue>\n" +
               "</Response>";
    }

    @GetMapping("/active")
    public ResponseEntity<List<CallLog>> getActiveCalls() {
        return ResponseEntity.ok(callService.getActiveCalls());
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<CallLog> endCall(@PathVariable Long id) {
        return ResponseEntity.ok(callService.endCall(id));
    }
}

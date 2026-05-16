package com.voicecart.controller;

import com.voicecart.model.AgentSession;
import com.voicecart.model.User;
import com.voicecart.repository.AgentSessionRepository;
import com.voicecart.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private AgentSessionRepository sessionRepository;
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String phone) {
        Optional<User> agentOpt = userRepository.findByPhoneNumber(phone);
        if (agentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User agent = agentOpt.get();
        if (agent.getRole() != User.Role.AGENT) {
            return ResponseEntity.badRequest().body("User is not an agent");
        }

        AgentSession session = new AgentSession();
        session.setAgent(agent);
        session = sessionRepository.save(session);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/sessions/{id}/logout")
    public ResponseEntity<?> logout(@PathVariable Long id) {
        Optional<AgentSession> sessionOpt = sessionRepository.findById(id);
        if (sessionOpt.isPresent()) {
            AgentSession session = sessionOpt.get();
            session.setLogoutTime(LocalDateTime.now());
            session.setStatus(AgentSession.SessionStatus.OFFLINE);
            return ResponseEntity.ok(sessionRepository.save(session));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/sessions/{id}/break")
    public ResponseEntity<?> toggleBreak(@PathVariable Long id) {
        Optional<AgentSession> sessionOpt = sessionRepository.findById(id);
        if (sessionOpt.isPresent()) {
            AgentSession session = sessionOpt.get();
            if (session.getStatus() == AgentSession.SessionStatus.ON_BREAK) {
                session.setStatus(AgentSession.SessionStatus.ONLINE);
            } else {
                session.setStatus(AgentSession.SessionStatus.ON_BREAK);
            }
            return ResponseEntity.ok(sessionRepository.save(session));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<AgentSession> getSession(@PathVariable Long id) {
        return sessionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public AgentController(AgentSessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    public AgentSessionRepository getSessionRepository() {
        return this.sessionRepository;
    }

    public void setSessionRepository(AgentSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public UserRepository getUserRepository() {
        return this.userRepository;
    }

    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

}

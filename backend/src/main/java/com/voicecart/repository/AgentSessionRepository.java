package com.voicecart.repository;

import com.voicecart.model.AgentSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgentSessionRepository extends JpaRepository<AgentSession, Long> {
    Optional<AgentSession> findTopByAgentIdOrderByLoginTimeDesc(Long agentId);
}

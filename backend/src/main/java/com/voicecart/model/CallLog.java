package com.voicecart.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "calls")
@Data
public class CallLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "call_sid", unique = true, length = 100)
    private String callSid;

    @Column(name = "customer_phone", nullable = false, length = 15)
    private String customerPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private User agent;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CallStatus status = CallStatus.RINGING;

    @CreationTimestamp
    @Column(name = "started_at", updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    public enum CallStatus {
        RINGING, IN_PROGRESS, COMPLETED, MISSED
    }
}

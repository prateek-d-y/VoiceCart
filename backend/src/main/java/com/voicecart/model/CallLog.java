package com.voicecart.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "calls")
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

    public CallLog() {}

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCallSid() {
        return this.callSid;
    }

    public void setCallSid(String callSid) {
        this.callSid = callSid;
    }

    public String getCustomerPhone() {
        return this.customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public User getAgent() {
        return this.agent;
    }

    public void setAgent(User agent) {
        this.agent = agent;
    }

    public LocalDateTime getStartedAt() {
        return this.startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getEndedAt() {
        return this.endedAt;
    }

    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
    }


    public CallStatus getStatus() {
        return this.status;
    }

    public void setStatus(CallStatus status) {
        this.status = status;
    }

}

package com.voicecart.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "agent_sessions")
public class AgentSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    @CreationTimestamp
    @Column(name = "login_time", updatable = false)
    private LocalDateTime loginTime;

    @Column(name = "logout_time")
    private LocalDateTime logoutTime;

    @Column(name = "total_break_time_seconds")
    private Integer totalBreakTimeSeconds = 0;

    @Column(name = "total_call_time_seconds")
    private Integer totalCallTimeSeconds = 0;

    @Column(name = "calls_taken")
    private Integer callsTaken = 0;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private SessionStatus status = SessionStatus.ONLINE;

    public enum SessionStatus {
        ONLINE, ON_BREAK, OFFLINE
    }

    public AgentSession() {}

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getAgent() {
        return this.agent;
    }

    public void setAgent(User agent) {
        this.agent = agent;
    }

    public LocalDateTime getLoginTime() {
        return this.loginTime;
    }

    public void setLoginTime(LocalDateTime loginTime) {
        this.loginTime = loginTime;
    }

    public LocalDateTime getLogoutTime() {
        return this.logoutTime;
    }

    public void setLogoutTime(LocalDateTime logoutTime) {
        this.logoutTime = logoutTime;
    }


    public Integer getTotalBreakTimeSeconds() {
        return this.totalBreakTimeSeconds;
    }

    public void setTotalBreakTimeSeconds(Integer totalBreakTimeSeconds) {
        this.totalBreakTimeSeconds = totalBreakTimeSeconds;
    }

    public Integer getTotalCallTimeSeconds() {
        return this.totalCallTimeSeconds;
    }

    public void setTotalCallTimeSeconds(Integer totalCallTimeSeconds) {
        this.totalCallTimeSeconds = totalCallTimeSeconds;
    }

    public Integer getCallsTaken() {
        return this.callsTaken;
    }

    public void setCallsTaken(Integer callsTaken) {
        this.callsTaken = callsTaken;
    }

    public SessionStatus getStatus() {
        return this.status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

}

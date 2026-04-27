package com.voicecart.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number", unique = true, nullable = false, length = 15)
    private String phoneNumber;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role = Role.CUSTOMER;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Role {
        CUSTOMER, AGENT
    }
}

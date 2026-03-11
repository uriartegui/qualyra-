package com.qualyra.backend.domain.organization;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 160)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrganizationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrganizationPlan plan = OrganizationPlan.FREE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Organization() {}

    public Organization(String name, OrganizationType type) {
        this.name = name;
        this.type = type;
        this.plan = OrganizationPlan.FREE;
        this.createdAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public OrganizationType getType() { return type; }
    public void setType(OrganizationType type) { this.type = type; }
    public OrganizationPlan getPlan() { return plan; }
    public Instant getCreatedAt() { return createdAt; }
}

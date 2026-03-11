package com.qualyra.backend.domain.regression;

import com.qualyra.backend.domain.organization.Organization;
import com.qualyra.backend.domain.template.Template;
import com.qualyra.backend.domain.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "regressions")
public class Regression {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @Column(nullable = false, length = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RegressionStatus status = RegressionStatus.IN_PROGRESS;

    @OneToMany(mappedBy = "regression", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RegressionItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Regression() {}

    public Regression(Organization organization, Template template, String name, User createdBy) {
        this.organization = organization;
        this.template = template;
        this.name = name;
        this.createdBy = createdBy;
        this.status = RegressionStatus.IN_PROGRESS;
        this.createdAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() { if (createdAt == null) createdAt = Instant.now(); }

    public UUID getId() { return id; }
    public Organization getOrganization() { return organization; }
    public Template getTemplate() { return template; }
    public String getName() { return name; }
    public RegressionStatus getStatus() { return status; }
    public void setStatus(RegressionStatus status) { this.status = status; }
    public List<RegressionItem> getItems() { return items; }
    public User getCreatedBy() { return createdBy; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
    public Instant getCreatedAt() { return createdAt; }
}

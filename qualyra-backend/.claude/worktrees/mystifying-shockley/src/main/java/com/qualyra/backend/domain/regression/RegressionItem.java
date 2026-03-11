package com.qualyra.backend.domain.regression;

import com.qualyra.backend.domain.rule.Rule;
import com.qualyra.backend.domain.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "regression_results",
        uniqueConstraints = @UniqueConstraint(columnNames = {"regression_id", "rule_id"}))
public class RegressionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "regression_id", nullable = false)
    private Regression regression;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rule_id", nullable = false)
    private Rule rule;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RegressionResultValue result;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "executed_by_id")
    private User executedBy;

    @Column(name = "executed_at")
    private Instant executedAt;

    public RegressionItem() {}

    public RegressionItem(Regression regression, Rule rule) {
        this.regression = regression;
        this.rule = rule;
    }

    public UUID getId() { return id; }
    public Regression getRegression() { return regression; }
    public Rule getRule() { return rule; }
    public RegressionResultValue getResult() { return result; }
    public void setResult(RegressionResultValue result) { this.result = result; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public User getExecutedBy() { return executedBy; }
    public void setExecutedBy(User executedBy) { this.executedBy = executedBy; }
    public Instant getExecutedAt() { return executedAt; }
    public void setExecutedAt(Instant executedAt) { this.executedAt = executedAt; }
}

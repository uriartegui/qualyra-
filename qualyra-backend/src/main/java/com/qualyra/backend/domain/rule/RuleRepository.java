package com.qualyra.backend.domain.rule;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RuleRepository extends JpaRepository<Rule, UUID> {
    Page<Rule> findByTopic_IdAndActiveTrue(UUID topicId, Pageable pageable);
    List<Rule> findByOrganization_IdAndActiveTrue(UUID organizationId);
}

package com.qualyra.backend.domain.topic;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TopicRepository extends JpaRepository<Topic, UUID> {
    Page<Topic> findByOrganization_IdAndActiveTrue(UUID organizationId, Pageable pageable);
}

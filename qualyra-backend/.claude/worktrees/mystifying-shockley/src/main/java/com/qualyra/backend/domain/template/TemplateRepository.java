package com.qualyra.backend.domain.template;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface TemplateRepository extends JpaRepository<Template, UUID> {

    Page<Template> findByOrganization_IdAndActiveTrue(UUID organizationId, Pageable pageable);

    @Query("SELECT t FROM Template t LEFT JOIN FETCH t.rules WHERE t.id = :id")
    Optional<Template> findByIdWithRules(UUID id);
}

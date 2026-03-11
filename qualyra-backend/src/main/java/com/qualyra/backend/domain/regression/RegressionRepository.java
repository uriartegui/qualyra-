package com.qualyra.backend.domain.regression;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface RegressionRepository extends JpaRepository<Regression, UUID> {

    Page<Regression> findByOrganization_Id(UUID organizationId, Pageable pageable);

    @Query("SELECT r FROM Regression r LEFT JOIN FETCH r.items i LEFT JOIN FETCH i.rule WHERE r.id = :id")
    Optional<Regression> findByIdWithItems(UUID id);
}

package com.qualyra.backend.domain.organization.dto;

import com.qualyra.backend.domain.organization.*;
import java.time.Instant;
import java.util.UUID;

public record OrganizationResponse(UUID id, String name, OrganizationType type, OrganizationPlan plan, Instant createdAt) {
    public OrganizationResponse(Organization o) {
        this(o.getId(), o.getName(), o.getType(), o.getPlan(), o.getCreatedAt());
    }
}

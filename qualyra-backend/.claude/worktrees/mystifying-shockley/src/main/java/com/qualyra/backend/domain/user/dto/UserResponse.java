package com.qualyra.backend.domain.user.dto;

import com.qualyra.backend.domain.user.Role;
import com.qualyra.backend.domain.user.User;
import java.util.UUID;

public record UserResponse(UUID id, String name, String email, Role role, boolean active, UUID organizationId) {
    public UserResponse(User u) {
        this(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.isActive(), u.getOrganization().getId());
    }
}

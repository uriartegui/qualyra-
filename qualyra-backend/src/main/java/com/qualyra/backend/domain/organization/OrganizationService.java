package com.qualyra.backend.domain.organization;

import com.qualyra.backend.domain.organization.dto.UpdateOrganizationRequest;
import com.qualyra.backend.domain.user.Role;
import com.qualyra.backend.domain.user.User;
import com.qualyra.backend.infrastructure.exception.ForbiddenException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public Organization findMine(User currentUser) {
        return currentUser.getOrganization();
    }

    @Transactional
    public Organization update(UpdateOrganizationRequest req, User currentUser) {
        if (currentUser.getRole() != Role.OWNER) {
            throw new ForbiddenException("Apenas OWNER pode editar a organização");
        }
        Organization org = currentUser.getOrganization();
        org.setName(req.name());
        org.setType(req.type());
        return organizationRepository.save(org);
    }
}

package com.qualyra.backend.domain.organization;

import com.qualyra.backend.domain.organization.dto.*;
import com.qualyra.backend.domain.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping("/me")
    public ResponseEntity<OrganizationResponse> getMine(@AuthenticationPrincipal User u) {
        return ResponseEntity.ok(new OrganizationResponse(organizationService.findMine(u)));
    }

    @PutMapping("/me")
    public ResponseEntity<OrganizationResponse> updateMine(@AuthenticationPrincipal User u,
                                                           @Valid @RequestBody UpdateOrganizationRequest req) {
        return ResponseEntity.ok(new OrganizationResponse(organizationService.update(req, u)));
    }
}

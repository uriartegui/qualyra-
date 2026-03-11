package com.qualyra.backend.domain.template;

import com.qualyra.backend.domain.template.dto.*;
import com.qualyra.backend.domain.user.User;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/templates")
public class TemplateController {

    private final TemplateService service;

    public TemplateController(TemplateService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TemplateResponse> create(@AuthenticationPrincipal User u,
                                                   @Valid @RequestBody TemplateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TemplateResponse(service.create(req, u)));
    }

    @GetMapping
    public ResponseEntity<Page<TemplateSummaryResponse>> findAll(
            @AuthenticationPrincipal User u,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(service.findAll(u, pageable).map(TemplateSummaryResponse::new));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemplateResponse> findById(@AuthenticationPrincipal User u,
                                                     @PathVariable UUID id) {
        return ResponseEntity.ok(new TemplateResponse(service.findById(id, u)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemplateResponse> update(@AuthenticationPrincipal User u,
                                                   @PathVariable UUID id,
                                                   @Valid @RequestBody TemplateRequest req) {
        return ResponseEntity.ok(new TemplateResponse(service.update(id, req, u)));
    }

    // Define quais regras o template tem (substitui todas)
    @PutMapping("/{id}/rules")
    public ResponseEntity<TemplateResponse> setRules(@AuthenticationPrincipal User u,
                                                     @PathVariable UUID id,
                                                     @Valid @RequestBody TemplateRulesRequest req) {
        return ResponseEntity.ok(new TemplateResponse(service.setRules(id, req, u)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@AuthenticationPrincipal User u,
                                           @PathVariable UUID id) {
        service.deactivate(id, u);
        return ResponseEntity.noContent().build();
    }
}

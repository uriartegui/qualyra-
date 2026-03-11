package com.qualyra.backend.domain.rule;

import com.qualyra.backend.domain.rule.dto.RuleRequest;
import com.qualyra.backend.domain.rule.dto.RuleResponse;
import com.qualyra.backend.domain.user.User;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class RuleController {

    private final RuleService service;

    public RuleController(RuleService service) {
        this.service = service;
    }

    // Criar regra dentro de um tópico
    @PostMapping("/topics/{topicId}/rules")
    public ResponseEntity<RuleResponse> create(@AuthenticationPrincipal User u,
                                               @PathVariable UUID topicId,
                                               @Valid @RequestBody RuleRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RuleResponse(service.create(topicId, req, u)));
    }

    // Listar regras de um tópico
    @GetMapping("/topics/{topicId}/rules")
    public ResponseEntity<Page<RuleResponse>> findByTopic(@AuthenticationPrincipal User u,
                                                          @PathVariable UUID topicId,
                                                          @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(service.findByTopic(topicId, u, pageable).map(RuleResponse::new));
    }

    // Listar todas as regras da org (usado na montagem de templates)
    @GetMapping("/rules")
    public ResponseEntity<List<RuleResponse>> findAll(@AuthenticationPrincipal User u) {
        return ResponseEntity.ok(service.findAllByOrg(u).stream()
                .map(RuleResponse::new).toList());
    }

    @PutMapping("/rules/{id}")
    public ResponseEntity<RuleResponse> update(@AuthenticationPrincipal User u,
                                               @PathVariable UUID id,
                                               @Valid @RequestBody RuleRequest req) {
        return ResponseEntity.ok(new RuleResponse(service.update(id, req, u)));
    }

    @DeleteMapping("/rules/{id}")
    public ResponseEntity<Void> deactivate(@AuthenticationPrincipal User u,
                                           @PathVariable UUID id) {
        service.deactivate(id, u);
        return ResponseEntity.noContent().build();
    }
}

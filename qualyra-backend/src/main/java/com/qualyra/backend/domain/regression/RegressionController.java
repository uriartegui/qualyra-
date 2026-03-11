package com.qualyra.backend.domain.regression;

import com.qualyra.backend.domain.regression.dto.*;
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
@RequestMapping("/regressions")
public class RegressionController {

    private final RegressionService service;

    public RegressionController(RegressionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<RegressionResponse> create(@AuthenticationPrincipal User u,
                                                     @Valid @RequestBody CreateRegressionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegressionResponse(service.create(req, u)));
    }

    @GetMapping
    public ResponseEntity<Page<RegressionSummaryResponse>> findAll(
            @AuthenticationPrincipal User u,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(service.findAll(u, pageable).map(RegressionSummaryResponse::new));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegressionResponse> findById(@AuthenticationPrincipal User u,
                                                       @PathVariable UUID id) {
        return ResponseEntity.ok(new RegressionResponse(service.findById(id, u)));
    }

    // Executar uma regra: marcar PASS / FAIL / SKIP
    @PatchMapping("/{id}/items/{itemId}")
    public ResponseEntity<RegressionResponse> executeItem(
            @AuthenticationPrincipal User u,
            @PathVariable UUID id,
            @PathVariable UUID itemId,
            @Valid @RequestBody ExecuteItemRequest req) {
        return ResponseEntity.ok(new RegressionResponse(service.executeItem(id, itemId, req, u)));
    }

    // Concluir a regressão
    @PatchMapping("/{id}/complete")
    public ResponseEntity<RegressionResponse> complete(@AuthenticationPrincipal User u,
                                                       @PathVariable UUID id) {
        return ResponseEntity.ok(new RegressionResponse(service.complete(id, u)));
    }
}

package com.qualyra.backend.domain.topic;

import com.qualyra.backend.domain.topic.dto.TopicRequest;
import com.qualyra.backend.domain.topic.dto.TopicResponse;
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
@RequestMapping("/topics")
public class TopicController {

    private final TopicService service;

    public TopicController(TopicService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TopicResponse> create(@AuthenticationPrincipal User u,
                                                @Valid @RequestBody TopicRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TopicResponse(service.create(req, u)));
    }

    @GetMapping
    public ResponseEntity<Page<TopicResponse>> findAll(@AuthenticationPrincipal User u,
                                                       @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(service.findAll(u, pageable).map(TopicResponse::new));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TopicResponse> findById(@AuthenticationPrincipal User u,
                                                  @PathVariable UUID id) {
        return ResponseEntity.ok(new TopicResponse(service.findById(id, u)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TopicResponse> update(@AuthenticationPrincipal User u,
                                                @PathVariable UUID id,
                                                @Valid @RequestBody TopicRequest req) {
        return ResponseEntity.ok(new TopicResponse(service.update(id, req, u)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@AuthenticationPrincipal User u,
                                           @PathVariable UUID id) {
        service.deactivate(id, u);
        return ResponseEntity.noContent().build();
    }
}

package com.qualyra.backend.domain.user;

import com.qualyra.backend.domain.user.dto.*;
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
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal User u) {
        return ResponseEntity.ok(new UserResponse(u));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@AuthenticationPrincipal User u,
                                                 @Valid @RequestBody UpdateUserRequest req) {
        return ResponseEntity.ok(new UserResponse(userService.update(u.getId(), req, u)));
    }

    @GetMapping
    public ResponseEntity<Page<UserResponse>> findAll(@AuthenticationPrincipal User u,
                                                      @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(userService.findAllByOrg(u, pageable).map(UserResponse::new));
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@AuthenticationPrincipal User u,
                                               @Valid @RequestBody CreateUserRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new UserResponse(userService.create(req, u)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> findById(@AuthenticationPrincipal User u, @PathVariable UUID id) {
        return ResponseEntity.ok(new UserResponse(userService.findById(id, u)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@AuthenticationPrincipal User u,
                                               @PathVariable UUID id,
                                               @Valid @RequestBody UpdateUserRequest req) {
        return ResponseEntity.ok(new UserResponse(userService.update(id, req, u)));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@AuthenticationPrincipal User u, @PathVariable UUID id) {
        userService.deactivate(id, u);
        return ResponseEntity.noContent().build();
    }
}

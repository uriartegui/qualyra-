package com.qualyra.backend.domain.user;

import com.qualyra.backend.domain.user.dto.CreateUserRequest;
import com.qualyra.backend.domain.user.dto.UpdateUserRequest;
import com.qualyra.backend.infrastructure.exception.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Page<User> findAllByOrg(User requester, Pageable pageable) {
        requireEditorOrAbove(requester);
        return userRepository.findByOrganization_IdAndActiveTrue(
                requester.getOrganization().getId(), pageable);
    }

    @Transactional
    public User create(CreateUserRequest req, User requester) {
        requireEditorOrAbove(requester);

        if (requester.getRole() == Role.EDITOR && req.role() != Role.VIEWER) {
            throw new ForbiddenException("EDITOR só pode criar usuários VIEWER");
        }
        if (requester.getRole() == Role.ADMIN &&
                (req.role() == Role.ADMIN || req.role() == Role.OWNER)) {
            throw new ForbiddenException("ADMIN pode criar apenas EDITOR ou VIEWER");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new BusinessException("Email já está em uso");
        }

        User user = new User(requester.getOrganization(), req.name(),
                req.email(), passwordEncoder.encode(req.password()), req.role());
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findById(UUID id, User requester) {
        requireEditorOrAbove(requester);
        return userRepository.findById(id)
                .filter(u -> u.getOrganization().getId().equals(requester.getOrganization().getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    @Transactional
    public User update(UUID id, UpdateUserRequest req, User requester) {
        User target = userRepository.findById(id)
                .filter(u -> u.getOrganization().getId().equals(requester.getOrganization().getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        boolean isSelf = target.getId().equals(requester.getId());
        if (!isSelf) requireEditorOrAbove(requester);

        target.setName(req.name());
        return userRepository.save(target);
    }

    @Transactional
    public void deactivate(UUID id, User requester) {
        if (requester.getRole() != Role.OWNER) {
            throw new ForbiddenException("Apenas OWNER pode desativar usuários");
        }
        User target = userRepository.findById(id)
                .filter(u -> u.getOrganization().getId().equals(requester.getOrganization().getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (target.getId().equals(requester.getId())) {
            throw new BusinessException("Não é possível desativar sua própria conta");
        }
        target.setActive(false);
        userRepository.save(target);
    }

    private void requireEditorOrAbove(User user) {
        if (user.getRole() == Role.VIEWER) {
            throw new ForbiddenException("Permissão insuficiente");
        }
    }
}

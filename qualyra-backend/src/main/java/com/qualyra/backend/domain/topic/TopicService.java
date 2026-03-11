package com.qualyra.backend.domain.topic;

import com.qualyra.backend.domain.topic.dto.TopicRequest;
import com.qualyra.backend.domain.user.Role;
import com.qualyra.backend.domain.user.User;
import com.qualyra.backend.infrastructure.exception.ForbiddenException;
import com.qualyra.backend.infrastructure.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class TopicService {

    private final TopicRepository repository;

    public TopicService(TopicRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Topic create(TopicRequest req, User currentUser) {
        requireEditorOrAbove(currentUser);
        Topic topic = new Topic(currentUser.getOrganization(),
                req.name(), req.description(), currentUser);
        return repository.save(topic);
    }

    @Transactional(readOnly = true)
    public Page<Topic> findAll(User currentUser, Pageable pageable) {
        return repository.findByOrganization_IdAndActiveTrue(
                currentUser.getOrganization().getId(), pageable);
    }

    @Transactional(readOnly = true)
    public Topic findById(UUID id, User currentUser) {
        return repository.findById(id)
                .filter(t -> t.getOrganization().getId()
                        .equals(currentUser.getOrganization().getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Tópico não encontrado"));
    }

    @Transactional
    public Topic update(UUID id, TopicRequest req, User currentUser) {
        requireEditorOrAbove(currentUser);
        Topic topic = findById(id, currentUser);
        topic.setName(req.name());
        topic.setDescription(req.description());
        return repository.save(topic);
    }

    @Transactional
    public void deactivate(UUID id, User currentUser) {
        requireAdminOrAbove(currentUser);
        Topic topic = findById(id, currentUser);
        topic.setActive(false);
        repository.save(topic);
    }

    private void requireEditorOrAbove(User user) {
        if (user.getRole() == Role.VIEWER) {
            throw new ForbiddenException("VIEWER não pode criar ou editar tópicos");
        }
    }

    private void requireAdminOrAbove(User user) {
        if (user.getRole() == Role.EDITOR || user.getRole() == Role.VIEWER) {
            throw new ForbiddenException("Apenas ADMIN ou OWNER podem excluir tópicos");
        }
    }
}

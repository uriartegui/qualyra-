package com.qualyra.backend.domain.rule;

import com.qualyra.backend.domain.rule.dto.RuleRequest;
import com.qualyra.backend.domain.topic.Topic;
import com.qualyra.backend.domain.topic.TopicService;
import com.qualyra.backend.domain.user.Role;
import com.qualyra.backend.domain.user.User;
import com.qualyra.backend.infrastructure.exception.ForbiddenException;
import com.qualyra.backend.infrastructure.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RuleService {

    private final RuleRepository repository;
    private final TopicService topicService;

    public RuleService(RuleRepository repository, TopicService topicService) {
        this.repository = repository;
        this.topicService = topicService;
    }

    @Transactional
    public Rule create(UUID topicId, RuleRequest req, User currentUser) {
        requireEditorOrAbove(currentUser);
        Topic topic = topicService.findById(topicId, currentUser);
        Rule rule = new Rule(currentUser.getOrganization(), topic,
                req.title(), req.description(), req.expectedResult(), currentUser);
        return repository.save(rule);
    }

    @Transactional(readOnly = true)
    public Page<Rule> findByTopic(UUID topicId, User currentUser, Pageable pageable) {
        topicService.findById(topicId, currentUser);
        return repository.findByTopic_IdAndActiveTrue(topicId, pageable);
    }

    @Transactional(readOnly = true)
    public List<Rule> findAllByOrg(User currentUser) {
        return repository.findByOrganization_IdAndActiveTrue(
                currentUser.getOrganization().getId());
    }

    @Transactional(readOnly = true)
    public Rule findById(UUID id, User currentUser) {
        return repository.findById(id)
                .filter(r -> r.getOrganization().getId()
                        .equals(currentUser.getOrganization().getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Regra não encontrada"));
    }

    @Transactional
    public Rule update(UUID id, RuleRequest req, User currentUser) {
        requireEditorOrAbove(currentUser);
        Rule rule = findById(id, currentUser);
        rule.setTitle(req.title());
        rule.setDescription(req.description());
        rule.setExpectedResult(req.expectedResult());
        return repository.save(rule);
    }

    @Transactional
    public void deactivate(UUID id, User currentUser) {
        requireAdminOrAbove(currentUser);
        Rule rule = findById(id, currentUser);
        rule.setActive(false);
        repository.save(rule);
    }

    private void requireEditorOrAbove(User user) {
        if (user.getRole() == Role.VIEWER) {
            throw new ForbiddenException("VIEWER não pode criar ou editar regras");
        }
    }

    private void requireAdminOrAbove(User user) {
        if (user.getRole() == Role.EDITOR || user.getRole() == Role.VIEWER) {
            throw new ForbiddenException("Apenas ADMIN ou OWNER podem excluir regras");
        }
    }
}

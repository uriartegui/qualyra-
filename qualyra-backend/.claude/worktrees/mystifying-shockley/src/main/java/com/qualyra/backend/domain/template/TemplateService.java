package com.qualyra.backend.domain.template;

import com.qualyra.backend.domain.rule.Rule;
import com.qualyra.backend.domain.rule.RuleRepository;
import com.qualyra.backend.domain.template.dto.TemplateRequest;
import com.qualyra.backend.domain.template.dto.TemplateRulesRequest;
import com.qualyra.backend.domain.user.Role;
import com.qualyra.backend.domain.user.User;
import com.qualyra.backend.infrastructure.exception.ForbiddenException;
import com.qualyra.backend.infrastructure.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TemplateService {

    private final TemplateRepository repository;
    private final RuleRepository ruleRepository;

    public TemplateService(TemplateRepository repository, RuleRepository ruleRepository) {
        this.repository = repository;
        this.ruleRepository = ruleRepository;
    }

    @Transactional
    public Template create(TemplateRequest req, User currentUser) {
        requireEditorOrAbove(currentUser);
        Template template = new Template(
                currentUser.getOrganization(), req.name(), req.description(), currentUser);
        return repository.save(template);
    }

    @Transactional(readOnly = true)
    public Page<Template> findAll(User currentUser, Pageable pageable) {
        return repository.findByOrganization_IdAndActiveTrue(
                currentUser.getOrganization().getId(), pageable);
    }

    @Transactional(readOnly = true)
    public Template findById(UUID id, User currentUser) {
        return repository.findByIdWithRules(id)
                .filter(t -> t.getOrganization().getId()
                        .equals(currentUser.getOrganization().getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Template não encontrado"));
    }

    @Transactional
    public Template update(UUID id, TemplateRequest req, User currentUser) {
        requireEditorOrAbove(currentUser);
        Template template = findById(id, currentUser);
        template.setName(req.name());
        template.setDescription(req.description());
        return repository.save(template);
    }

    @Transactional
    public Template setRules(UUID id, TemplateRulesRequest req, User currentUser) {
        requireEditorOrAbove(currentUser);
        Template template = findById(id, currentUser);

        Set<Rule> rules = req.ruleIds().stream()
                .map(ruleId -> ruleRepository.findById(ruleId)
                        .filter(r -> r.getOrganization().getId()
                                .equals(currentUser.getOrganization().getId()))
                        .filter(Rule::isActive)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Regra não encontrada: " + ruleId)))
                .collect(Collectors.toSet());

        template.getRules().clear();
        template.getRules().addAll(rules);
        return repository.save(template);
    }

    @Transactional
    public void deactivate(UUID id, User currentUser) {
        requireAdminOrAbove(currentUser);
        Template template = findById(id, currentUser);
        template.setActive(false);
        repository.save(template);
    }

    private void requireEditorOrAbove(User user) {
        if (user.getRole() == Role.VIEWER) {
            throw new ForbiddenException("VIEWER não pode criar ou editar templates");
        }
    }

    private void requireAdminOrAbove(User user) {
        if (user.getRole() == Role.EDITOR || user.getRole() == Role.VIEWER) {
            throw new ForbiddenException("Apenas ADMIN ou OWNER podem excluir templates");
        }
    }
}
